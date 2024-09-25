import { ApiErrors } from "../errors/api.errors";
import { IUser } from "../interfaces/IUser";
import { userRepository } from "../repositories/user.repository";

class UserService {
  public async getList(): Promise<IUser[]> {
    return await userRepository.getList();
  }

  public async getById(userId: string): Promise<IUser> {
    const user = await userRepository.getById(userId);
    if (!user) {
      throw new ApiErrors("not user", 404);
    }
    return user;
  }
  public async getByIdPut(userId: string, dto: IUser): Promise<void> {
    await userRepository.getByIdPut(userId, dto);
  }
  public async deleteById(userId: string): Promise<void> {
    await userRepository.deleteById(userId);
  }
}

export const userService = new UserService();
