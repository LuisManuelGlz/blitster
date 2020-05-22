import { injectable } from 'inversify';
import 'reflect-metadata';
import { UserForRegisterDTO } from '../interfaces/user';

@injectable()
export default class AuthService {
  // eslint-disable-next-line class-methods-use-this
  SignUp(userForRegisterDTO: UserForRegisterDTO): UserForRegisterDTO {
    return userForRegisterDTO;
  }
}
