import { Loader } from "@aex/loader";
import * as fs from "fs";
import * as path from "path";
import { createConnection } from 'typeorm';


export async function createTypeorm(loadDir: string, options: any) {
  let dir = loadDir;
  if (!path.isAbsolute(dir)) {
    const dirs = Loader.getDirs();
    const parentDir = dirs[2];
    dir = path.resolve(parentDir, dir);
  }
  if (!fs.existsSync(dir)) {
    throw new Error("Not such directory!");
  }
  const loader = new Loader(dir, true);
  const models: any = loader.load();
  const entities: any = [];
  for (const key of Object.keys(models)) {
    entities.push(models[key]);
  }
  options.entities = entities;
  const connection = await createConnection(options);
  // tslint:disable-next-line:variable-name
  return async (_req: any, _res: any, scope: any) => {
    scope.outer.typeorm = {
      connection,
      models
    };
  };
};