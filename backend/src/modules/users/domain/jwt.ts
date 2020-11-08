import { sign, verify } from 'jsonwebtoken';

import { Entity } from '../../../shared/domain/Entity';
import * as authConfig from '../../../config/auth';
import { AppError } from '../../../shared/core/AppError';

export interface JWTClaims {
  userId?: string;
  isEmailVerified?: boolean;
  email?: string;
}

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export type JWTToken = string;
export type RefreshToken = string;

export class Jwt extends Entity<any> {
  public static decodeJwt(token: RefreshToken): JWTToken {
    if (!token) {
      throw new AppError('JWT token is missing', 401);
    }

    try {
      const decode = verify(
        token,
        authConfig.REFRESH_TOKEN_SECRET,
      ) as TokenPayload;
      return decode.sub;
    } catch (err) {
      throw new AppError(err.message || 'Invalid JWT token', 401);
    }
  }

  public static generateAccessToken(claims: JWTClaims): JWTToken {
    return sign({ sub: claims.userId }, authConfig.ACCESS_TOKEN_SECRET, {
      expiresIn: authConfig.ACCESS_TOKEN_EXPIRES_IN,
    });
  }

  public static generateRefreshToken(claims: JWTClaims): RefreshToken {
    return sign({ sub: claims.email }, authConfig.REFRESH_TOKEN_SECRET, {
      expiresIn: authConfig.REFRESH_TOKEN_EXPIRES_IN,
    });
  }
}
