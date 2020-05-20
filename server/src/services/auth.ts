import { injectable, inject } from 'inversify';
import "reflect-metadata";
import { IUserForRegisterDTO } from '../interfaces/IUser';

@injectable()
export default class AuthService {
  constructor() { }
  
  public SignUp(userForRegisterDTO: IUserForRegisterDTO): IUserForRegisterDTO {
    return userForRegisterDTO;
  }
}