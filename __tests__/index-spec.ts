
import { Aex } from "@aex/core";
import * as path from "path";
import { createTypeorm } from '../src/index';
import { responseText } from "./util/test";

test('Should connect to sqlite3', async () => {
  const options = {
    database: path.resolve(__dirname, "./store/project.db"),
    synchronize: true,
    type: "sqlite",
  }
  const middleware = await createTypeorm("./models/", options);

  const scope: any = {
    outer: {
      typeorm: {}
    }
  };

  await middleware({}, {}, scope);

  const { connection, models } = scope.outer.typeorm;

  expect(connection).toBeTruthy();
  expect(models.Photo);
  const User = models.User;
  const user = new User();
  expect(user).toBeTruthy();
  user.age = 100;
  user.firstName = "hello";
  user.lastName = "world!";
  await user.save();
  expect(user.id).toBeTruthy();
  await connection.close();
});

test('Should connect to sqlite3', async () => {
  const options = {
    database: path.resolve(__dirname, "./store/project.db"),
    synchronize: true,
    type: "sqlite",
  }
  const middleware = await createTypeorm(path.resolve(__dirname, "./models/"), options);

  const scope: any = {
    outer: {
      typeorm: {}
    }
  };

  await middleware({}, {}, scope);

  const { connection, models } = scope.outer.typeorm;

  expect(connection).toBeTruthy();
  expect(models.Photo);
  const User = models.User;
  const user = new User();
  expect(user).toBeTruthy();
  user.age = 100;
  user.firstName = "hello";
  user.lastName = "world!";
  await user.save();
  expect(user.id).toBeTruthy();
  await connection.close();
});

test('Should throw Exception when no directory found!', async () => {
  const options = {
    database: path.resolve(__dirname, "./store/project.db"),
    synchronize: true,
    type: "sqlite",
  }
  let catched = false;
  try {
    await createTypeorm("../models/", options);
  } catch (e) {
    catched = true;
  }
  expect(catched).toBeTruthy();
});

test('Should work with aex', async () => {
  const options = {
    database: path.resolve(__dirname, "./store/project.db"),
    synchronize: true,
    type: "sqlite",
  }
  const middleware = await createTypeorm(path.resolve(__dirname, "./models/"), options);

  const aex = new Aex();

  aex.use(middleware);
  // tslint:disable-next-line:variable-name
  aex.use(async (_req:any, res, scope: any) => {
    const { connection, models } = scope.outer.typeorm;

    expect(connection).toBeTruthy();
    expect(models.Photo);
    const User = models.User;
    const user = new User();
    expect(user).toBeTruthy();
    user.age = 100;
    user.firstName = "hello";
    user.lastName = "world!";
    await user.save();
    expect(user.id).toBeTruthy();
    await connection.close();
    res.end("ok");
  });
  await responseText(aex, "ok");
});

