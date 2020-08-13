/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import config from '../../config';
import { UnauthorizedError } from '../../helpers/errors';
import JwtService from '../../services/jwt.service';
import { DecoredToken } from '../../interfaces/decodedToken';

export default (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization;

  if (!token) throw new UnauthorizedError();

  if (token?.split(' ')[0] === config.tokenType) {
    const decoded = Container.get(JwtService).verifyToken(token?.split(' ')[1]);
    req.userId = (decoded as DecoredToken)._id;
    req.userUsername = (decoded as DecoredToken).username;
    req.userEmail = (decoded as DecoredToken).email;
    return next();
  }

  throw new UnauthorizedError();
};
