/**
 * @swagger
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

import { Document } from 'mongoose';
import { User } from './user';

export interface RefreshToken extends Document {
  user: User;
  refreshToken: string;
}

export interface RefreshTokenForTokenDTO {
  userId: string;
  refreshToken: string;
}

export interface TokenOutput {
  tokenType: string;
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}
