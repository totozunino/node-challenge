# Node Challenge

Node.js code challenge to apply for jobsity

## Built with

Here is a list of major frameworks/libraries used:

- [Turborepo](https://turbo.build/repo/docs/).
- [Nest.js](https://nestjs.com/)
- [Typescript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/)
- [TypeORM](https://typeorm.io/)
- [Docker](https://www.docker.com/)

## What's inside?

This monorepo includes the following packages/apps:

### Apps and Packages

- `api-service`: a [Nest.js](https://nestjs.com/) app
- `stock-service`: a [Nest.js](https://nestjs.com/) app
- `dtos`: a TypeScript package containing data transfer objects used by the `api-service` and `stock-service`
- `eslint-config-custom`: `eslint` configurations
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

## Getting Started

### Installation

_Below is an example of how you can run the project._

### Docker way

You can get it up and running by using docker compose.

```sh
$ docker-compose up
```

This will run the `api-service` and `stock-service` with the corresponding setup like running migrations and set env variables

### You can also can do this without docker, it will take more steps but its ok

- Install NPM packages

  ```sh
  npm install
  ```

- Create and `.env` file in `./apps/api-service` path(you can copy values from `.env.example`)
  ```js
  DB_TYPE = "sqlite";
  DB_NAME = "database.sqlite";
  STOCK_SERVICE_URL = "http://localhost:3001/stocks";
  JWT_SECRET = "secret";
  ```
- Build all apps and packages

  ```sh
  npm run build

  # Build specific app example
  npm run build -- --filter="api-service"
  ```

- Run migrations this will create the database and the schema
  ```sh
  cd apps/api-service # Move to api-service where the migrations are
  npm run db:migrate
  ```
- Run all apps

  ```sh
  npm run dev

  ```

### Documentation

The services APIs were documented using Swagger to see the documentation go to `SERVICE_URL/api` in your browser

- [Api Service Swagger](http://localhost:3000/api)
- [Stock Service Swagger](http://localhost:3001/api)

### Tests

To run all test specs

```sh
npm run test

```

### Author

Mathias Zunino \
mathiaszunino@gmail.com
