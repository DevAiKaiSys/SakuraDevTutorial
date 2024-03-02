# Installation

```bash
$ npm i -g @nestjs/cli
$ nest new project-name
```

# ORM

## [Prisma](https://www.prisma.io/docs/getting-started/quickstart)

Recipes [Prisma](https://docs.nestjs.com/recipes/prisma#use-prisma-client-in-your-nestjs-services) document

example code [rest-nestjs](https://github.com/prisma/prisma-examples/tree/latest/typescript/rest-nestjs)

```bash
$ npm install prisma --save-dev
$ npx prisma init --datasource-provider sqlite
```

add model user and migrate to db

```
// ./prisma/schema.prisma
model User {
  id       Int     @id @default(autoincrement())
  email    String  @unique
  name     String?
  password String
}
```

```bash
$ npx prisma migrate dev --name init
```
