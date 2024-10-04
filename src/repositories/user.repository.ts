// import { ApiErrors } from "../errors/api.errors";
import { IUser } from "../interfaces/IUser";
import { User } from "../models/user.model";
// import { read, write } from "../services/fs.service";

class UserRepository {
  public async getList(): Promise<IUser[]> {
    return await User.find({});
  }
  public async create(dto: Partial<IUser>): Promise<IUser> {
    return await User.create(dto);
  }
  public async getById(userId: string): Promise<IUser | null> {
    return await User.findById(userId);
  }
  public async getByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }).select("+password");
  }

  public async getByIdPut(userId: string, dto: Partial<IUser> ): Promise<IUser> {
    return await User.findByIdAndUpdate(userId, dto, { new: true });
  }
  public async deleteById(userId: string): Promise<void> {
    await User.deleteOne({ _id: userId });
  }
}

export const userRepository = new UserRepository();
