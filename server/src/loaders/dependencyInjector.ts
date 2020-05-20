import { Container } from "inversify";
import { TYPES } from "../constants/types";
import AuthService from "../services/auth";

const containter = new Container();

containter
  .bind<AuthService>(TYPES.AuthService)
  .to(AuthService)
  .inSingletonScope();

export { containter };
