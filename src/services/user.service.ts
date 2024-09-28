import { ApiErrors } from "../errors/api.errors";
import { ITokenPayload } from "../interfaces/IToken";
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
  public async getMe(jwtPayload: ITokenPayload): Promise<IUser> {
    const user = await userRepository.getById(jwtPayload.userId);
    if (!user) {
      throw new ApiErrors("not user", 404);
    }
    return user;
  }
  public async updateMe(jwtPayload: ITokenPayload, dto: IUser): Promise<void> {
    await userRepository.getByIdPut(jwtPayload.userId, dto);
  }
  public async deleteMe(jwtPayload: ITokenPayload): Promise<void> {
    await userRepository.deleteById(jwtPayload.userId);
  }
}

export const userService = new UserService();
