import fs from "node:fs/promises";
import path from "node:path";

import { IUser } from "../interfaces/IUser";

const read = async (): Promise<IUser[]> => {
  const pathToFile = path.join(process.cwd(), "db.json");
  const data = await fs.readFile(pathToFile, "utf-8");
  console.log(pathToFile);
  // console.log(data)
  return data ? JSON.parse(data) : [];
};
const write = async (user: IUser[]): Promise<void> => {
  const pathToFile = path.join(process.cwd(), "db.json");
  await fs.writeFile(pathToFile, JSON.stringify(user));
};
export { read, write };
