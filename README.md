[![Build Status](https://travis-ci.org/aex-ts-node/orm-typeorm.svg?branch=master)](https://travis-ci.org/aex-ts-node/orm-typeorm.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/aex-ts-node/orm-typeorm/badge.svg?branch=master)](https://coveralls.io/github/aex-ts-node/orm-typeorm?branch=master)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

# @aex/typeorm

Aex middleware for typeorm.

# Usage

## Prepare models

```sh
# ./models
├── Photo.ts
└── User.ts
```
Photo.ts: 
```ts
import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Photo extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    filename: string;

    @Column()
    views: number;

    @Column()
    isPublished: boolean;
}
```

User.ts
```ts
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

}
```

## Create a Aex middleware for typeorm

```ts
import { createTypeorm } from "@aex/typeorm";
const options = {
  database: path.resolve(__dirname, "./store/project.db"),
  synchronize: true,
  type: "sqlite"
};
const middleware = await createTypeorm("./models/", options);
```

## Add the middleware to aex

```ts
const aex = new Aex();
aex.use(middleware);
```

## Use typeorm in the subsequence middlewares

```ts
aex.use(async (_req: any, res, scope: any) => {
  const { connection, models } = scope.outer.typeorm;
  const User = models.User;
  const user = new User();
  user.age = 100;
  user.firstName = "hello";
  user.lastName = "world!";
  await user.save();
  console.log(user.id);
  await connection.close();
  res.end("ok");
});
```
