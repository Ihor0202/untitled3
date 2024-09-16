import express, { Request, Response } from "express";

import { read, write } from "./fs.service";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.get("/users", async (req: Request, res: Response) => {
  const users = await read();
  try {
    // const users = read()
    res.send(users);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

app.post("/users", async (req: Request, res: Response) => {
  // console.log(req.body)
  try {
    const { name, email, password } = req.body;
    if (!name || name < 3) {
      return res.status(400).send("name is bed");
    }
    if (!email || !email.includes("@")) {
      return res.status(400).send("email is bed");
    }
    if (!password || password < 4) {
      return res.status(400).send("email is bed");
    }

    const users = await read();

    const id = users[users.length - 1].id + 1;
    const newUser = { id, name, email, password };
    users.push(newUser);
    await write(users);
  } catch (e) {
    res.status(500).send(e.message);
  }
  res.send("post hello world ");
});

app.get("/users/:userId", async (req: Request, res: Response) => {
  const users = await read();
  try {
    const userId = Number(req.params.userId);
    const user = users.find((user) => user.id === userId);
    if (!user) {
      res.send("not user");
    }
    res.send(user);
  } catch (e) {
    res.send(e.message);
  }
});

app.put("/users/:userId", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || name < 3) {
      return res.status(400).send("name is bed");
    }
    if (!email || !email.includes("@")) {
      return res.status(400).send("email is bed");
    }
    if (!password || password < 4) {
      return res.status(400).send("email is bed");
    }

    const users = await read();

    const userId = Number(req.params.userId);
    const userIndex = users.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
      return res.status(404).send("User not found");
    }

    users[userIndex].name = name;
    users[userIndex].email = email;
    users[userIndex].password = password;

    await write(users);

    res.status(201).send(users[userIndex]);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

app.delete("/users/:userId", async (req: Request, res: Response) => {
  const users = await read();
  try {
    const userId = Number(req.params.userId);
    const userIndex = users.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
      return res.status(500).send("user not found");
    }
    users.splice(userIndex, 1);

    await write(users);

    res.sendStatus(204);
  } catch (e) {
    res.send(e.message);
  }
});

app.listen(3000, () => {
  console.log("run server http://localhost:3000/");
});
