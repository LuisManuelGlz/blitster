import { Router, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import AuthService from '../../services/auth';

const route = Router();

export default (app: Router) => {
  app.use("/auth", route);

  route.post(
    "/signup",
    (req: Request, res: Response) => {
      return res.status(200).end();
    }
  );
};
