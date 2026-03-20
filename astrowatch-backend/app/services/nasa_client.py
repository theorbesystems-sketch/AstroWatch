import hashlib
import json
import time
import logging
from typing import Any, Optional
from collections import OrderedDict

import httpx
from fastapi import HTTPException

from app.core.config import settings

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Cache in-memory com limites de tamanho (LRU) e TTL sem libs externas
# Estrutura: { cache_key: (dados, timestamp_expiracao) }
# ---------------------------------------------------------------------------
_cache: OrderedDict[str, tuple[Any, float]] = OrderedDict()
_MAX_CACHE_SIZE = 1000

# TTL por prefixo de endpoint (em segundos)
# Lógica: dados que mudam raramente ficam mais tempo em cache
_TTL_MAP: dict[str, int] = {
    "/planetary/apod":        86400,  # APOD muda 1x por dia → 24h
    "/EPIC/api/natural":       3600,  # EPIC: novas imagens a cada ~hora → 1h
    "/DONKI/CME":              1800,  # Eventos solares: atualiza ~30min → 30min
    "/DONKI/FLR":              1800,
    "/DONKI/GST":              1800,
    "/neo/rest/v1/feed":       3600,  # Feed de asteroides: 1h
    "/neo/rest/v1/neo/":      86400,  # Dados fixos de um asteroide → 24h
}
_DEFAULT_TTL: int = 1800  # fallback: 30 minutos


def _make_key(endpoint: str, params: dict) -> str:
    """Gera uma chave de cache a partir do endpoint + params (sem a api_key)."""
    safe_params = {k: v for k, v in params.items() if k != "api_key"}
    raw_key = f"{endpoint}:{json.dumps(safe_params, sort_keys=True)}"
    # Se a string ficar muito grande com os parâmetros, usamos hash
    if len(raw_key) > 200:
        return hashlib.sha256(raw_key.encode()).hexdigest()
    return raw_key


def _get_ttl(endpoint: str) -> int:
    """Retorna o TTL adequado para o endpoint."""
    for prefix, ttl in _TTL_MAP.items():
        if endpoint.startswith(prefix):
            return ttl
    return _DEFAULT_TTL


def _cache_get(key: str) -> Optional[Any]:
    """Retorna os dados do cache se ainda válidos (movendo pro final como LRU), ou None."""
    entry = _cache.get(key)
    if entry is None:
        return None
    data, expires_at = entry
    if time.monotonic() < expires_at:
        _cache.move_to_end(key)  # Marca como recentemente usado
        return data
    # Expirou — limpa a entrada
    del _cache[key]
    return None


def _cleanup_expired() -> None:
    """Limpa chaves expiradas em todo o cache para liberar memória."""
    now = time.monotonic()
    keys_to_delete = [k for k, v in _cache.items() if now >= v[1]]
    for k in keys_to_delete:
        del _cache[k]


def _cache_set(key: str, data: Any, ttl: int) -> None:
    """Armazena os dados, com expiração e política de tamanho máximo (LRU)."""
    if len(_cache) >= _MAX_CACHE_SIZE:
        _cleanup_expired()
    # Se ainda estiver cheio após varrer expirados, remove o mais antigo (LRU)
    if len(_cache) >= _MAX_CACHE_SIZE:
        _cache.popitem(last=False)
        
    _cache[key] = (data, time.monotonic() + ttl)
    _cache.move_to_end(key)


def cache_stats() -> dict:
    """Retorna estatísticas do cache (útil para debug/monitoramento)."""
    now = time.monotonic()
    total = len(_cache)
    valid = sum(1 for _, expires_at in _cache.values() if now < expires_at)
    return {
        "total_entries": total,
        "valid_entries": valid,
        "expired_entries": total - valid,
        "max_size": _MAX_CACHE_SIZE
    }


# ---------------------------------------------------------------------------
# Função principal de chamada à NASA
# ---------------------------------------------------------------------------
async def fetch_from_nasa(endpoint: str, params: dict = None) -> Any:
    """
    Busca dados da NASA de forma assíncrona com cache TTL automático.

    - A api_key é injetada internamente e nunca exposta ao cliente.
    - Respostas são cacheadas por TTL definido por tipo de endpoint.
    - Erros da NASA são tratados sem vazar detalhes internos.
    """
    if params is None:
        params = {}

    # Evitar mutação no dicionário original enviado como argumento
    req_params = params.copy()

    # Verifica cache ANTES de fazer a requisição
    cache_key = _make_key(endpoint, req_params)
    cached = _cache_get(cache_key)
    if cached is not None:
        logger.debug("Cache HIT: %s", endpoint)
        return cached

    logger.debug("Cache MISS: %s — buscando na NASA", endpoint)

    # Injeta a chave da API de forma segura apenas na cópia
    req_params["api_key"] = settings.NASA_API_KEY
    url = f"{settings.NASA_BASE_URL}{endpoint}"

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params=req_params, timeout=10.0)
            response.raise_for_status()
            data = response.json()

            # Armazena no cache com TTL adequado
            ttl = _get_ttl(endpoint)
            _cache_set(cache_key, data, ttl)
            logger.info("Cached '%s' por %ds", endpoint, ttl)

            return data

        except httpx.HTTPStatusError as e:
            # Não expõe a URL completa (com a chave) no erro retornado ao cliente
            raise HTTPException(
                status_code=e.response.status_code,
                detail="Erro ao comunicar com a API da NASA.",
            )
        except httpx.RequestError:
            raise HTTPException(
                status_code=503,
                detail="Serviço da NASA indisponível no momento.",
            )
