import { Container, Service } from 'typedi';
import 'reflect-metadata';
import { UserForRegisterDTO } from '../interfaces/user';
import MailerService from './mailer.service';

@Service()
export default class AuthService {
  private readonly mailerService: MailerService;

  constructor() {
    this.mailerService = Container.get(MailerService);
  }

  SignUp(userForRegisterDTO: UserForRegisterDTO): UserForRegisterDTO {
    this.mailerService.SendEmail();

    return userForRegisterDTO;
  }
}
