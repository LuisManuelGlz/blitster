import { Service } from 'typedi';
import jwt from 'jsonwebtoken';
import randtoken from 'rand-token';
import config from '../config';

@Service()
export default class JwtService {
  generateAccessToken(payload: object): string {
    return jwt.sign(payload, config.secretKey);
  }

  generateRefreshToken(): string {
    return randtoken.uid(80);
  }
}
