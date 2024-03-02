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

[nest CLI command](https://docs.nestjs.com/cli/usages#nest-generate)

```bash
$ nest g mo user
$ nest g s user --no-spec
$ nest g co user --no-spec
```

or Generating a new [resource](https://docs.nestjs.com/recipes/crud-generator#generating-a-new-resource)

```bash
$ nest g resource users --no-spec
```

### [Prisma Studio](https://www.prisma.io/docs/orm/tools/prisma-studio)

visual editor for the data in database

```bash
$ npx prisma studio
```

# [Validation](https://docs.nestjs.com/techniques/validation)

```bash
$ npm i --save class-validator class-transformer
```

# [Authentication](https://docs.nestjs.com/security/authentication)

## [Hashing](https://docs.nestjs.com/security/encryption-and-hashing#hashing)

### [bcrypt](https://github.com/kelektiv/node.bcrypt.js)

```bash
$ npm install bcrypt
$ npm i -D @types/bcrypt
```

```bash
$ nest g mo auth
$ nest g s auth --no-spec
$ nest g co auth --no-spec
```

### [JWT token](https://docs.nestjs.com/security/authentication#jwt-token)

```bash
$ npm install --save @nestjs/jwt
```
