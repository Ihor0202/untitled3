import express, { NextFunction, Request, Response } from "express";

import { ApiErrors } from "./errors/api.errors";
import { userRouter } from "./routers/user.router";
// import { read, write } from "./services/fs.service";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRouter);

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
// app.get("/users", async (req: Request, res: Response, next: NextFunction) => {
//   const users = await read();
//   try {
//     // const users = read()
//     res.send(users);
//   } catch (e) {
//     next(e);
//   }
// });

//
// app.post("/users", async (req: Request, res: Response, next: NextFunction) => {
//   // console.log(req.body)
//   try {
//     const { name, email, password } = req.body;
//     if (!name || name < 3) {
//       throw new ApiErrors("name is bed", 400);
//     }
//     if (!email || !email.includes("@")) {
//       throw new ApiErrors("email is bed", 400);
//     }
//     if (!password || password < 4) {
//       throw new ApiErrors("email is bed", 400);
//     }
//
//     const users = await read();
//
//     const id = users[users.length - 1].id + 1;
//     const newUser = { id, name, email, password };
//     users.push(newUser);
//     await write(users);
//   } catch (e) {
//     next(e);
//   }
//   res.send("post hello world ");
// });
//
// app.get(
//   "/users/:userId",
//   async (req: Request, res: Response, next: NextFunction) => {
//     const users = await read();
//     try {
//       const userId = Number(req.params.userId);
//       const user = users.find((user) => user.id === userId);
//       if (!user) {
//         throw new ApiErrors("not user", 404);
//       }
//       res.send(user);
//     } catch (e) {
//       next(e);
//     }
//   },
// );
//
// app.put(
//   "/users/:userId",
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { name, email, password } = req.body;
//
//       if (!name || name < 3) {
//         throw new ApiErrors("name is bed", 400);
//       }
//       if (!email || !email.includes("@")) {
//         throw new ApiErrors("email is bed", 400);
//       }
//       if (!password || password < 4) {
//         throw new ApiErrors("email is bed", 400);
//       }
//
//       const users = await read();
//
//       const userId = Number(req.params.userId);
//       const userIndex = users.findIndex((user) => user.id === userId);
//       if (userIndex === -1) {
//         throw new ApiErrors("User not found", 404);
//       }
//
//       users[userIndex].name = name;
//       users[userIndex].email = email;
//       users[userIndex].password = password;
//
//       await write(users);
//
//       res.status(201).send(users[userIndex]);
//     } catch (e) {
//       next(e);
//     }
//   },
// );
//
// app.delete(
//   "/users/:userId",
//   async (req: Request, res: Response, next: NextFunction) => {
//     const users = await read();
//     try {
//       const userId = Number(req.params.userId);
//       const userIndex = users.findIndex((user) => user.id === userId);
//       if (userIndex === -1) {
//         throw new ApiErrors("user not found", 404);
//       }
//       users.splice(userIndex, 1);
//
//       await write(users);
//
//       res.sendStatus(204);
//     } catch (e) {
//       next(e);
//     }
//   },
// );

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

app.listen(3000, () => {
  console.log("run server http://localhost:3000/");
});
