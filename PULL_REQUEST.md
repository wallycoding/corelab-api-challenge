# CORELAB API CHALLENGE

## Executando Localmente

Para dar vida ao projeto, siga os passos abaixo:

1. Inicie o container Docker e o projeto com o comando:

```bash
$ make stage.up
```

2. Quando terminar, você pode derrubar os containers com:

```bash
$ make stage.down
```

## Acesso aos Containers

Se desejar interagir com os containers, utilize os seguintes comandos:

- Para a aplicação:

```bash
$ docker exec -it api sh
```

- Para PostgreSQL:

```bash
$ docker exec -it db bash
```

## Testes

Execute os testes com os seguintes comandos:

- Testes unitários:

```bash
$ npm run test
```

- Testes e2e:

```bash
$ npm run test:e2e
```

- Testes de cobertura:

```bash
$ npm run test:cov
```

## Estrutura da Aplicação

A organização do projeto é a seguinte:

- `src`

  - `main.ts`
    - Inicialização do Nest.js
  - `app.module.ts`
    - Carrega todos os módulos
  - `modules`
    - `{name}`
      - `controllers`
        - `{name}.controller.spec.ts`
        - `{name}.controller.ts`
      - `services`
        - `{name}.service.spec.ts`
        - `{name}.service.ts`
      - `data`
        - `adapters`
          - `{name}`
            - `{name}.adapter.spec.ts`
            - `{name}.adapter.ts`
      - `domain`
        - `entities`
          - `{name}.ts`
        - `repository`
          - `{name}.ts`
      - `dto`
        - `{name}.dto.spec.ts`
        - `{name}.dto.ts`
      - `{name}.module.ts`

- `test`
  - `{name}.e2e-spec.ts`
    - Testes e2e

## Rotas da Aplicação

As rotas disponíveis na aplicação são:

- `/api` (GET)
- `/note/list` (GET)
- `/note/:id` (GET)
- `/note/add` (POST)
- `/note/:id` (PATCH)
- `/note/:id` (DELETE)

## Padrões e Paradigmas

O projeto segue os seguintes padrões e paradigmas:

- (OOP) Programação Orientada a Objetos
- (TDD) Desenvolvimento Orientado por Testes
- (DDD) Design Orientado a Domínio
- (DI) Injeção de Dependência
- (DIP) Princípio da Inversão de Dependência
- (DTO) Objeto de Transferência de Dados
- (DP) Padrão Decorator
