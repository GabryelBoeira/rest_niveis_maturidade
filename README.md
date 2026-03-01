# rest_niveis_maturidade

REST e Níveis de Maturidade na prática

## Descrição

Este projeto é uma implementação de arquitetura REST em Node.js/TypeScript demonstrando os 3 níveis do modelo de maturidade REST (Richardson Maturity Model). Fornece um exemplo prático de como estruturar rotas, serviços, entidades e recursos, além de técnicas básicas de caching e controle de versão de API.

Principais características

- API REST construída com Express e TypeORM (TypeScript).
- Modelo de dados com entidades: User, Customer, Product, Category, Cart, Order, Payment.
- Exemplos de rotas públicas e protegidas (JWT).
- Implementação de recursos e coleções (HATEOAS simples).
- Suporte a respostas em JSON e CSV para endpoints administrativos.
- Simulação de armazenamento rápido com SQLite em memória (configuração em [src/database.ts](src/database.ts)).
- Exemplo de configuração para reverse-proxy com Nginx em [.docker/nginx](.docker/nginx).

Tecnologias

- Node.js, TypeScript
- Express
- TypeORM
- SQLite
- Docker + Nginx (exemplo de proxy)

Como executar (rápido)

1. Instalar dependências:
   - npm install
2. Rodar em modo de desenvolvimento:
   - npm run dev
3. (Opcional) Utilizar Docker para o proxy Nginx:
   - Verificar [.docker/nginx/nginx.conf](.docker/nginx/nginx.conf) e [.docker/nginx/Dockerfile](.docker/nginx/Dockerfile)

Arquivos importantes

- [src/app.ts](src/app.ts) — ponto de entrada e middleware principais
- [src/database.ts](src/database.ts) — configuração do TypeORM
- [src/routes](src/routes) — rotas da aplicação
- [src/services/product.service.ts](src/services/product.service.ts) — exemplo de serviço de domínio
- [src/http/resource.ts](src/http/resource.ts) — implementação de Resource / ResourceCollection
