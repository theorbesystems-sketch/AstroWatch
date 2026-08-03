# ORBE ARCHITECTURE PROTOCOL

Este documento estabelece as diretrizes arquiteturais para os projetos da Orbe Systems, focando em escalabilidade, segurança e integridade de dados.

## 1. Rate Limiting e Escalabilidade (Fase 1 para Fase 3)

### Fase 1: MVP e Memória Local
No início do projeto, o Rate Limiter (`slowapi`) é configurado utilizando a memória local (`slowapi.util.get_remote_address`) para armazenar o estado das requisições (por IP).
- **Vantagem:** Simplicidade de deploy, sem necessidade de infraestrutura adicional.
- **Desvantagem:** Se o backend escalar horizontalmente (ex: múltiplos workers/instâncias no Render ou AWS), a memória local não será compartilhada. O rate limit falhará em ser global.

> [!WARNING]
> **Risco de Spoofing e Extração de IP:** Em infraestruturas com Proxy Reverso ou Load Balancers (ex: Cloudflare, Vercel, AWS), o `get_remote_address` pode ler o IP do próprio Load Balancer em vez do cliente. 
> **Mitigação (Fase 1+):** É imperativo configurar o framework para ler e confiar corretamente nos cabeçalhos `X-Forwarded-For` ou `X-Real-IP`, garantindo que apenas proxies confiáveis da infraestrutura possam repassar essa informação, evitando ataques de injeção e spoofing.

### Fase 3: Escalabilidade Horizontal com Redis
Para garantir que o rate limiting funcione perfeitamente num ambiente distribuído, a infraestrutura deve evoluir:
- **Transição:** Substituir o armazenamento de estado do `slowapi` (memória) por um banco de dados em memória **Redis**.
- **Benefício:** Todas as instâncias do backend compartilharão o mesmo estado de limite de requisições, evitando falhas em picos de tráfego e garantindo a resiliência do sistema contra ataques DDoS ou gargalos nas APIs subjacentes (NASA, SpaceX, etc).

> [!IMPORTANT]
> **Política de Degradação (Fail-Open):** A introdução do Redis adiciona uma dependência de rede no caminho crítico das requisições. O protocolo exige uma abordagem **Fail-Open**. Se o Redis não responder dentro de um timeout agressivo (ex: 50ms), a requisição do cliente **deve ser permitida** (pass-through). Isso garante que o sistema se mantenha online, assumindo o risco temporário de carga excessiva nos workers subjacentes em prol da disponibilidade para o usuário.

## 2. Rate Limiting Multidimensional (Evolução)

Restringir acesso exclusivamente por IP torna-se ineficaz quando usuários estão atrás de Carrier-Grade NAT (CGNAT), comum no Brasil, onde milhares compartilham o mesmo IP público, podendo gerar falsos positivos de negação de serviço.

**Estratégia de Evolução:**
- **Rotas Públicas:** Manter limitação baseada na heurística de IP bem configurada (protegendo endpoints de login, páginas institucionais ou dashboards abertos).
- **Rotas Autenticadas/Críticas:** Aplicar restrições baseadas em Identidade, como o `User ID` extraído de um **Bearer Token (JWT)** validado, permitindo um limite de cota granular e por usuário, ignorando problemas de NAT.
