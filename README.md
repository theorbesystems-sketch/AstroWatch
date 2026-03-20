# AstroWatch by OrbeSystems

**AstroWatch** é o Painel de Controle Operacional de última geração focado na telemetria planetária e na observação tática do espaço sideral, desenvolvido com exclusividade pela **OrbeSystems**. O projeto é guiado pela missão fundamental de prover inteligência de ameaças geospaciais e eletromagnéticas com resposta visual em tempo real, garantindo a defesa de infraestruturas cibernéticas e matrizes críticas terrestres.

## Módulos Operacionais

- **Defesa de Infraestrutura (DONKI):** Módulo voltado à identificação de anomalias solares (CMEs, Tempestades Geomagnéticas) e à tradução destes eventos num indicador preciso de *Status de Monitoramento AstroWatch*. Conta com mapa de impacto interativo de redes elétricas e sistemas satelitais críticos.
- **Telemetria Terrestre (Earth):** Interface imersiva geospacial 3D habilitada por WebGL para o rastreamento em tempo real do nosso planeta, alicerçando análises sobre vetores ambientais (Delta Processor).
- **Varredura Orbital (NeoWs):** Visor avançado de instrumentação por radar capaz de sondar Objetos Próximos à Terra (Asteroides) reportando suas trajetórias, dimensionamento e apresentando proativamente o algoritmo de classificação proprietário: `Score OrbeSystems`.

## Arquitetura Corporativa

O projeto sustenta os mais altos padrões da OrbeSystems empregando:
- Backend desenvolvido em **Python** (FastAPI) altamente desacoplado, com pipeline de requisições estabilizado via proxy de cache (estratégia LRU nativa).
- Frontend estruturado como um Single Page Application (SPA), através do ecosistema robusto do **React** associado ao **Vite**.
- Estética Cyberpunk Tática de Alto-Desempenho com suporte completo para componentes de design via **Glassmorphism** e motores de partículas WebGL.

### Deployments Seguros e Autorização (CORS)

Os endpoints do *OrbeSystems AstroWatch API* validam ativamente por cabeçalho CORS limitando execuções ao ambiente oficial hospedado provido pela OrbeSystems. Para configurar o destino final em produção:

1. Modifique a constante `ALLOWED_ORIGIN` no `config.py` ou declare-a como variável de ambiente no servidor (Ex: `https://orbesystems.github.io`).
2. No frontend, declare `VITE_API_BASE_URL` no gerenciador de seu host apontando para a URL online da API FastAPI.

### Manual de Deployment Rápido

**Backend (Render, Heroku, Railway, etc):**
- O projeto já entrega o `Procfile` (`web: uvicorn app.main:app --host 0.0.0.0 --port $PORT`).
- Basta plugar o repositório na Cloud. A aplicação reconhecerá automaticamente a porta liberada.

**Frontend (GitHub Pages, Vercel, Netlify):**
- O SPA utiliza `HashRouter`, sendo 100% nativo e imune a erros 404 de navegação em qualquer CDN (Static Hosts).
- Comando de Build: `npm run build`
- Pasta publicável gerada: `dist/`

*© 2026 OrbeSystems. Plataforma AstroWatch. Todos os direitos reservados.*
