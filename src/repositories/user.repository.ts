import { ApiErrors } from "../errors/api.errors";
import { IUser } from "../interfaces/IUser";
import { read, write } from "../services/fs.service";

class UserRepository {
  public async getList(): Promise<IUser[]> {
    return await read();
  }
  public async create(dto: Partial<IUser>): Promise<IUser> {
    const users = await read();

    const newUser = {
      id: users.length ? users[users.length - 1]?.id + 1 : 1,
      name: dto.name,
      email: dto.email,
      password: dto.password,
    };
    users.push(newUser);
    await write(users);

    return newUser;
  }
  public async getById(userId: number): Promise<IUser | null> {
    const users = await read();
    return users.find((user) => user.id === userId);
  }

  public async getByIdPut(userId: number, dto: IUser): Promise<IUser> {
    const users = await read();
    const userIndex = users.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
      throw new ApiErrors("User not found", 404);
    }
    users[userIndex].name = dto.name;
    users[userIndex].email = dto.email;
    users[userIndex].password = dto.password;

    await write(users);
    return users[userIndex];
  }
  public async deleteById(userId: number): Promise<void> {
    const users = await read();

    const userIndex = users.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
      throw new ApiErrors("user not found", 404);
    }
    users.splice(userIndex, 1);

    await write(users);
  }
}

export const userRepository = new UserRepository();
