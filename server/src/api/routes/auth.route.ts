import { Router, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { containter } from "../../config/inversify.config";
import AuthService from "../../services/auth.service";
import { TYPES } from "../../constants/types";
import { IUserForRegisterDTO } from "../../interfaces/IUser";

const route = Router();

export default (app: Router) => {
  app.use("/auth", route);

  route.post(
    "/signup",
    [
      check("username", "Please write a username").notEmpty(),
      check(
        "email",
        "Please write your email, I won't spam you, I promise"
      ).isEmail(),
      check(
        "password1",
        "Please enter a password with 8 or more characters"
      ).isLength({ min: 8 }),
      check(
        "password2",
        "Please enter a password with 8 or more characters"
      ).isLength({ min: 8 }),
    ],
    (req: Request, res: Response) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const authServiceInstance = containter.get<AuthService>(
        TYPES.AuthService
      );

      console.log(authServiceInstance.SignUp(req.body as IUserForRegisterDTO));

      return res.status(201).end();
    }
  );
};
