import { Service } from 'typedi';
import jwt from 'jsonwebtoken';
import randtoken from 'rand-token';
import config from '../config';
import { UnauthorizedError } from '../helpers/errors';
import { User } from '../interfaces/user';

@Service()
export default class JwtService {
  generateAccessToken(user: User): string {
    const payload = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    };

    return jwt.sign(payload, config.secretKey, {
      expiresIn: config.AccessTokenLifetime,
    });
  }

  generateRefreshToken(): string {
    return randtoken.uid(80);
  }

  verifyToken(token: string): string | object {
    try {
      return jwt.verify(token, config.secretKey);
    } catch {
      throw new UnauthorizedError();
    }
  }
}
