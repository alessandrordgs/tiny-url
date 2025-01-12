# TinyURL Project

Este projeto é um encurtador de URLs construído com NestJS. Ele permite criar URLs curtas, gerenciar usuários e visualizar estatísticas de acesso.

## Descrição

O TinyURL é uma aplicação que permite aos usuários encurtar URLs longas, gerenciar suas URLs e visualizar estatísticas de acesso. A aplicação é construída utilizando NestJS, TypeORM e PostgreSQL.

## Pré-requisitos

- Docker
- Docker Compose

## Instruções para Executar o Projeto com Docker Compose

1. Clone o repositório:

```sh
git clone https://github.com/alessandrordgs/tiny-url.git
cd tiny-url
```

2. Execute o Docker Compose:

```sh
docker-compose up --build
```

3. Acesse a aplicação em [http://localhost:3000](http://localhost:3000).

## Endpoints

- `POST /create-url`: Cria uma nova URL curta.
- `GET /urls/list`: Lista todas as URLs do usuário autenticado.
- `GET /:code`: Redireciona para a URL original.
- `DELETE /urls/:id`: Deleta uma URL.
- `PATCH /urls/:code`: Atualiza uma URL.

## Documentação da API

A documentação da API está disponível em [http://localhost:3000/docs](http://localhost:3000/docs).

## Licença

Este projeto está licenciado sob a licença MIT.
