import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import config from '../../config';
import { UnauthorizedError } from '../../helpers/errors';
import JwtService from '../../services/jwtService';

export default (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization;

  if (!token) throw new UnauthorizedError();

  if (token?.split(' ')[0] === config.tokenType) {
    Container.get(JwtService).verifyToken(token?.split(' ')[1]);
    return next();
  }

  throw new UnauthorizedError();
};
