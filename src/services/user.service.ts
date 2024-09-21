import { ApiErrors } from "../errors/api.errors";
import { IUser } from "../interfaces/IUser";
import { userRepository } from "../repositories/user.repository";

class UserService {
  public async getList(): Promise<IUser[]> {
    return await userRepository.getList();
  }
  public async create(dto: Partial<IUser>): Promise<any> {
    if (!dto.name || dto.name.length < 3) {
      throw new ApiErrors(
        "Name is required and should be at least 3 characters long",
        400,
      );
    }
    if (!dto.email || !dto.email.includes("@")) {
      throw new ApiErrors("Email is required and should be valid", 400);
    }
    if (!dto.password || dto.password.length < 6) {
      throw new ApiErrors(
        "Password is required and should be at least 6 characters long",
        400,
      );
    }
    return await userRepository.create(dto);
  }

  public async getById(userId: number): Promise<IUser> {
    const user = await userRepository.getById(userId);
    if (!user) {
      throw new ApiErrors("not user", 404);
    }
    return user;
  }
  public async getByIdPut(userId: number, dto: IUser): Promise<void> {
    // h
    // const user = 404
    if (!dto.name || dto.name.length < 3) {
      throw new ApiErrors(
        "Name is required and should be at least 3 characters long",
        400,
      );
    }
    if (!dto.email || !dto.email.includes("@")) {
      throw new ApiErrors("Email is required and should be valid", 400);
    }
    if (!dto.password || dto.password.length < 6) {
      throw new ApiErrors(
        "Password is required and should be at least 6 characters long",
        400,
      );
    }
    await userRepository.getByIdPut(userId, dto);
  }
  public async deleteById(userId: number): Promise<void> {
    await userRepository.deleteById(userId);
  }
}

export const userService = new UserService();
