import express, { NextFunction, Request, Response } from "express";
import * as mongoose from "mongoose";

import { configs } from "./config/configs";
import { ApiErrors } from "./errors/api.errors";
import { authRouter } from "./routers/auth.router";
import { userRouter } from "./routers/user.router";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRouter);
app.use("/auth", authRouter);

// [
//      {"id": 1, "name": "Maksym", "email": "feden@gmail.com", "password": "qwe123"},
//      {"id": 2, "name": "Alina", "email": "alindosik@gmail.com", "password": "ert345"},
//      {"id": 3, "name": "Anna", "email": "ann43@gmail.com", "password": "ghj393"},
//      {"id": 4, "name": "Tamara", "email": "tomochka23@gmail.com", "password": "afs787"},
//      {"id": 5, "name": "Dima", "email": "taper@gmail.com", "password": "rtt443"},
//      {"id": 6, "name": "Rita", "email": "torpeda@gmail.com", "password": "vcx344"},
//      {"id": 7, "name": "Denis", "email": "denchik@gmail.com", "password": "sdf555"},
//      {"id": 8, "name": "Sergey", "email": "BigBoss@gmail.com", "password": "ccc322"},
//      {"id": 9, "name": "Angela", "email": "lala@gmail.com", "password": "cdd343"},
//      {"id": 10, "name": "Irina", "email": "irka7@gmail.com", "password": "kkk222"}
//  ]

app.use(
  "*",
  (error: ApiErrors, req: Request, res: Response, next: NextFunction) => {
    res.status(error.status || 500).send(error.message);
  },
);

process.on("uncaughtException", (error) => {
  console.error(error.message, error.stack);
  process.exit(1);
});

app.listen(configs.APP_PORT, async () => {
  await mongoose.connect(configs.MONGO_URI);
  console.log(`run server http://${configs.APP_HOST}:${configs.APP_PORT}`);
});
