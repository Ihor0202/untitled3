import {NextFunction, Request, Response} from "express";

import {TokenTypeEnum} from "../enums/token.type.enum";
import {ApiErrors} from "../errors/api.errors";
import {tokenRepository} from "../repositories/token.repository";
import {tokenService} from "../services/token.service";
import {ActionTokenTypeEnum} from "../enums/action-token-type.enum";
import {actionTokenRepository} from "../repositories/action-token.repository";

class AuthMiddleware {
  public async checkAccessToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const header = req.headers.authorization;
      if (!header) {
        throw new ApiErrors("Token is not provided", 401);
      }
      const accessToken = header.split("Bearer ")[1];
      const payload = tokenService.verifyToken(
        accessToken,
        TokenTypeEnum.ACCESS,
      );

      const pair = await tokenRepository.findByParams({ accessToken });
      if (!pair) {
        throw new ApiErrors("Token is not valid", 401);
      }
      req.res.locals.tokenId = pair._id;

      req.res.locals.jwtPayload = payload;
      next();
    } catch (e) {
      next(e);
    }
  }
  public async checkRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const header = req.headers.authorization;
      if (!header) {
        throw new ApiErrors("Token is not provided", 401);
      }
      const refreshToken = header.split("Bearer ")[1];
      const payload = tokenService.verifyToken(
        refreshToken,
        TokenTypeEnum.REFRESH,
      );

      const pair = await tokenRepository.findByParams({ refreshToken });
      if (!pair) {
        throw new ApiErrors("Token is not valid", 401);
      }
      req.res.locals.jwtPayload = payload;
      req.res.locals.refreshTokens = refreshToken;
      next();
    } catch (e) {
      next(e);
    }
  }

  public checkActionToken(type: ActionTokenTypeEnum) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const token = req.body.token as string;
        if (!token) {
          throw new ApiErrors("Token is not provided", 401);
        }
        const payload = tokenService.verifyToken(token, type);

        const tokenEntity = await actionTokenRepository.getByToken(token);
        if (!tokenEntity) {
          throw new ApiErrors("Token is not valid", 401);
        }
        req.res.locals.jwtPayload = payload;
        next();
      } catch (e) {
        next(e);
      }
    };
  }
}

export const authMiddleware = new AuthMiddleware();
