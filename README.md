# Contract Testing: NestJS + PactJS + Pact Broker

Этот проект демонстрирует контрактное тестирование между NestJS consumer `FrontendConsumer` и NestJS provider `ProductProvider` с использованием PactJS и локального Pact Broker. Поддерживаются локальные запуски и CI в GitHub Actions (Node 18).

## Требования

- Node.js 18 LTS
- Docker + Docker Compose

## Структура

- `consumer/` — NestJS consumer (`/frontend/products/:id`)
- `provider/` — NestJS provider (`/products/:id`, `POST /products`)
- `broker/docker-compose.yml` — Pact Broker + Postgres
- `.github/workflows/contract-ci.yml` — CI пайплайн

## Локальный запуск

1. Запустить брокер:
   - `npm run broker:up`
   - URL: `http://localhost:9292` (если включить basic auth: `PACT_BROKER_USERNAME`/`PACT_BROKER_PASSWORD`)

2. Сгенерировать и опубликовать контракты (consumer):
   - `cd consumer && npm ci`
   - `npm run test:pact`
   - PowerShell:
     ```powershell
     $env:PACT_BROKER_BASE_URL='http://localhost:9292'
     $env:PACT_BROKER_USERNAME='pact'
     $env:PACT_BROKER_PASSWORD='pact'
     $env:GITHUB_SHA='local'
     $env:GITHUB_REF_NAME='local'
     npm run publish:pact
     ```

3. Верифицировать контракты (provider):
   - `cd ../provider && npm ci`
   - PowerShell:
     ```powershell
     $env:PACT_BROKER_BASE_URL='http://localhost:9292'
     $env:PACT_BROKER_USERNAME='pact'
     $env:PACT_BROKER_PASSWORD='pact'
     $env:GIT_SHA='local'
     $env:GITHUB_REF_NAME='local'
     npm run verify:pact
     ```

4. Остановить брокер: `npm run broker:down`

## CI (GitHub Actions)

Workflow: `.github/workflows/contract-ci.yml`
- Поднимает Pact Broker как service container
- Consumer: запускает Pact-тесты и публикует контракты в Broker
- Provider: выполняет верификацию
- `can-i-deploy` проверяет совместимость

Требуемые Secrets репозитория:
- `PACT_BROKER_USERNAME`
- `PACT_BROKER_PASSWORD`

## Переменные окружения

- Consumer:
  - `PROVIDER_BASE_URL` — URL провайдера (по умолчанию `http://localhost:3002`)
- Provider:
  - `PORT` — порт сервера (по умолчанию 3002)
- Broker:
  - `PACT_BROKER_BASE_URL` (например, `http://localhost:9292`)
  - `PACT_BROKER_USERNAME`/`PACT_BROKER_PASSWORD` — если включена basic auth

## Технические детали

- **Consumer**: использует Pact V3 с `PactV3` и `executeTest` для стабильных тестов
- **Provider**: верификация через `consumerVersionSelectors` и `providerVersionBranch`
- **Docker**: публикация контрактов через `pactfoundation/pact-cli` с `--network host`
- **CI**: автоматический цикл с брокером как service container

## Примечания

- Контракты сохраняются в `consumer/pacts/` и публикуются в Broker.
- Верификация провайдера подтягивает контракты из Broker и публикует результат.
- На Windows используйте PowerShell для установки переменных окружения.


