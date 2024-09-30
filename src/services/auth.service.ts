import {ApiErrors} from "../errors/api.errors";
import {ITokenPair, ITokenPayload} from "../interfaces/IToken";
import {ISignIn, IUser} from "../interfaces/IUser";
import {tokenRepository} from "../repositories/token.repository";
import {userRepository} from "../repositories/user.repository";
import {passwordService} from "./password.service";
import {tokenService} from "./token.service";
import {emailService} from "./email.service";
import {EmailTypeEnum} from "../enums/email-type.enum";

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

    // await emailService.sendEmail("oros.ihor@student.uzhnu.edu.ua")
    await emailService.sendEmail(
        EmailTypeEnum.WELCOME,
        "moddi0202@gmail.com",
        {name: user.name},
    )
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
      tokenId: string
  ): Promise<void> {
    const user = await userRepository.getById(jwtPayload.userId);
    await tokenRepository.deleteOneByParams({_id: tokenId});

    await emailService.sendEmail(EmailTypeEnum.LOGOUT, user.email, {
        name: user.name
      })
  }

  public async logoutAll(jwtPayload: ITokenPayload): Promise<void> {
    // const user = await userRepository.getById(jwtPayload.userId);
    await tokenRepository.deleteManyByParams({_userId: jwtPayload.userId});
    // await emailService.sendEmail(EmailTypeEnum.LOGOUT, user.email, {
    //   name: user.name
    // })


  }
}

export const authService = new AuthService();
