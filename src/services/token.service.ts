import * as jsonwebtoken from "jsonwebtoken";

import { configs } from "../config/configs";
import { ApiErrors } from "../errors/api.errors";
import { ITokenPair, ITokenPayload } from "../interfaces/IToken";

class TokenService {
  public generateTokens(payload: ITokenPayload): ITokenPair {
    const accessToken = jsonwebtoken.sign(payload, configs.JWT_ACCESS_SECRET, {
      expiresIn: configs.JWT_ACCESS_EXPIRATION,
    });
    const refreshToken = jsonwebtoken.sign(
      payload,
      configs.JWT_REFRESH_SECRET,
      {
        expiresIn: configs.JWT_REFRESH_EXPIRATION,
      },
    );
    return { accessToken, refreshToken };
  }

  public verifyToken(token: string): ITokenPayload {
    try {
      return jsonwebtoken.verify(
        token,
        configs.JWT_ACCESS_SECRET,
      ) as ITokenPayload;
    } catch (e) {
      throw new ApiErrors("Invalid" + e.message, 401);
    }
  }
}
export const tokenService = new TokenService();
