import { Service } from 'typedi';
import jwt from 'jsonwebtoken';
import randtoken from 'rand-token';
import config from '../config';
import { UnauthorizedError } from '../helpers/errors';

@Service()
export default class JwtService {
  generateAccessToken(payload: object): string {
    return jwt.sign(payload, config.secretKey, {
      expiresIn: config.AccessTokenLifetime,
    });
  }

  generateRefreshToken(): string {
    return randtoken.uid(80);
  }

  verifyToken(token: string): void {
    jwt.verify(token, config.secretKey, (error) => {
      if (error) throw new UnauthorizedError();
    });
  }
}
