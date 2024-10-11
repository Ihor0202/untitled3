import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { EmailTypeEnum } from "../enums/email-type.enum";
import { ApiErrors } from "../errors/api.errors";
import { ITokenPair, ITokenPayload } from "../interfaces/IToken";
import {
  IChangePassword,
  IResetPasswordSend,
  IResetPasswordSet,
  ISignIn,
  IUser,
} from "../interfaces/IUser";
import { actionTokenRepository } from "../repositories/action-token.repository";
import { oldPasswordRepository } from "../repositories/old-password.repository";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { emailService } from "./email.service";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";

class AuthService {
  public async signUp(
    dto: Partial<IUser>,
  ): Promise<{ user: IUser; tokens: ITokenPair }> {
    await this.isEmailExistOrThrow(dto.email);
    const password = await passwordService.hashPassword(dto.password);
    const user = await userRepository.create({ ...dto, password });

    const tokens = tokenService.generateTokens({
      userId: user._id,
      role: user.role,
    });
    await tokenRepository.create({ ...tokens, _userId: user._id });

    const token = tokenService.generateActionTokens(
      { userId: user._id, role: user.role },
      ActionTokenTypeEnum.VERIFY_EMAIL,
    );
    await actionTokenRepository.create({
      type: ActionTokenTypeEnum.FORGOT_PASSWORD,
      _userId: user._id,
      token,
    });

    await emailService.sendEmail(
      EmailTypeEnum.WELCOME,
      // "moddi0202@gmail.com",
      dto.email,
      {
        name: user.name,
        actionToken: token,
      },
    );
    return { user, tokens };
  }

  // public async signIn(dto: any): Promise<any> {}
  public async signIn(
    dto: ISignIn,
  ): Promise<{ user: IUser; tokens: ITokenPair }> {
    const user = await userRepository.getByEmail(dto.email);
    if (!user) {
      throw new ApiErrors("User not found", 404);
    }

    const isPasswordCorrect = await passwordService.comparePassword(
      dto.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new ApiErrors("Invalid credentials", 401);
    }

    const tokens = tokenService.generateTokens({
      userId: user._id,
      role: user.role,
    });
    await tokenRepository.create({ ...tokens, _userId: user._id });

    // await emailService.sendEmail("moddi0202@gmail.com",
    //     EmailTypeEnum.WELCOME)
    return { user, tokens };
  }

  public async refresh(
    refreshToken: string,
    payload: ITokenPayload,
  ): Promise<ITokenPair> {
    await tokenRepository.deleteOneByParams({ refreshToken });
    const tokens = tokenService.generateTokens({
      userId: payload.userId,
      role: payload.role,
    });
    await tokenRepository.create({ ...tokens, _userId: payload.userId });
    return tokens;
  }
  private async isEmailExistOrThrow(email: string): Promise<void> {
    const user = await userRepository.getByEmail(email);
    if (user) {
      throw new ApiErrors("email already exist", 409);
    }
  }
  public async logout(
    jwtPayload: ITokenPayload,
    tokenId: string,
  ): Promise<void> {
    const user = await userRepository.getById(jwtPayload.userId);
    await tokenRepository.deleteOneByParams({ _id: tokenId });

    await emailService.sendEmail(EmailTypeEnum.LOGOUT, user.email, {
      name: user.name,
    });
  }

  public async logoutAll(jwtPayload: ITokenPayload): Promise<void> {
    const user = await userRepository.getById(jwtPayload.userId);
    await tokenRepository.deleteManyByParams({ _userId: jwtPayload.userId });
    await emailService.sendEmail(EmailTypeEnum.LOGOUT, user.email, {
      name: user.name,
    });
  }

  public async forgotPasswordSendEmail(dto: IResetPasswordSend): Promise<void> {
    const user = await userRepository.getByEmail(dto.email);
    if (!user) {
      throw new ApiErrors("user not found", 404);
    }

    const token = tokenService.generateActionTokens(
      { userId: user._id, role: user.role },
      ActionTokenTypeEnum.FORGOT_PASSWORD,
    );
    await actionTokenRepository.create({
      type: ActionTokenTypeEnum.FORGOT_PASSWORD,
      _userId: user._id,
      token,
    });
    await emailService.sendEmail(
      EmailTypeEnum.FORGOT_PASSWORD,
      user.email,
      // "moddi0202@gmail.com",
      {
        name: user.name,
        email: user.email,
        actionToken: token,
      },
    );
  }
  public async forgotPasswordSet(
    dto: IResetPasswordSet,
    jwtPayload: ITokenPayload,
  ): Promise<void> {
    const password = await passwordService.hashPassword(dto.password);
    await userRepository.getByIdPut(jwtPayload.userId, { password });

    await actionTokenRepository.deleteManyByParams({
      _userId: jwtPayload.userId,
      type: ActionTokenTypeEnum.FORGOT_PASSWORD,
    });
    await tokenRepository.deleteManyByParams({ _userId: jwtPayload.userId });
  }
  public async verify(jwtPayload: ITokenPayload): Promise<void> {
    await userRepository.getByIdPut(jwtPayload.userId, { isVerified: true });
    await actionTokenRepository.deleteManyByParams({
      _userId: jwtPayload.userId,
      type: ActionTokenTypeEnum.VERIFY_EMAIL,
    });
  }

  public async changePassword(
    jwtPayload: ITokenPayload,
    dto: IChangePassword,
  ): Promise<void> {
    const [user, oldPassword] = await Promise.all([
      userRepository.getById(jwtPayload.userId),
      oldPasswordRepository.findByParams(jwtPayload.userId),
    ]);
    const isPasswordCorrect = await passwordService.comparePassword(
      dto.oldPassword,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new ApiErrors("Invalid previous password", 401);
    }

    const passwords = [...oldPassword, { password: user.password }];
    await Promise.all(
      passwords.map(async (oldPassword) => {
        const isPrevious = await passwordService.comparePassword(
          dto.password,
          oldPassword.password,
        );
        if (isPrevious) {
          throw new ApiErrors("Password already used", 409);
        }
      }),
    );

    const password = await passwordService.hashPassword(dto.password);
    await userRepository.getByIdPut(jwtPayload.userId, { password });
    await oldPasswordRepository.create({
      _userId: jwtPayload.userId,
      password: user.password,
    });
    await tokenRepository.deleteManyByParams({ _userId: jwtPayload.userId });
  }
}

export const authService = new AuthService();
