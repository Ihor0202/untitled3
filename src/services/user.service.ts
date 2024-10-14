import { UploadedFile } from "express-fileupload";

import { FileItemTypeEnum } from "../enums/file-item-type.enum";
import { ApiErrors } from "../errors/api.errors";
import { ITokenPayload } from "../interfaces/IToken";
import { IUser } from "../interfaces/IUser";
import { userRepository } from "../repositories/user.repository";
import { s3Service } from "./s3.servise";

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
  public async uploadAvatar(
    jwtPayload: ITokenPayload,
    file: UploadedFile,
  ): Promise<IUser> {
    const user = await userRepository.getById(jwtPayload.userId);

    const avatar = await s3Service.uploadFile(
      file,
      FileItemTypeEnum.USER,
      user._id,
    );
    const updatedUser = await userRepository.getByIdPut(user._id, { avatar });
    if (user.avatar) {
      await s3Service.deleteFile(user.avatar);
    }
    return updatedUser;
  }
  public async deleteAvatar(jwtPayload: ITokenPayload): Promise<IUser> {
    const user = await userRepository.getById(jwtPayload.userId);
    if (user.avatar) {
      await s3Service.deleteFile(user.avatar);
    }
    return await userRepository.getByIdPut(user._id, {
      avatar: null,
    });
  }
}

export const userService = new UserService();
