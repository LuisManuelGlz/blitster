import { Container, Service, Inject } from 'typedi';
import 'reflect-metadata';
import bcrypt from 'bcrypt';
import cripto from 'crypto';
import { UserForRegisterDTO, User } from '../interfaces/user';
import MailerService from './mailer.service';

@Service()
export default class AuthService {
  private readonly mailerService: MailerService;

  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
    @Inject('tokenModel') private tokenModel: Models.TokenModel,
  ) {
    this.mailerService = Container.get(MailerService);
  }

  async SignUp(userForRegisterDTO: UserForRegisterDTO): Promise<User> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let { email } = userForRegisterDTO;
    const { password1 } = userForRegisterDTO;

    email = email.trim();

    const salt = bcrypt.genSaltSync();
    const passwordHash = bcrypt.hashSync(password1, salt);

    const userCreated = await this.userModel.create({
      ...userForRegisterDTO,
      passwordHash,
    });

    const token = cripto.randomBytes(16).toString('hex');

    await this.tokenModel.create({
      user: userCreated,
      token,
    });

    this.mailerService.SendEmail(userCreated.email, token);

    const user = userCreated.toObject();

    Reflect.deleteProperty(user, 'passwordHash');

    return user;
  }
}
