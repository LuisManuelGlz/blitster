import { Container, Service, Inject } from 'typedi';
import 'reflect-metadata';
import bcrypt from 'bcrypt';
import cripto from 'crypto';
import jwt from 'jsonwebtoken';
import randtoken from 'rand-token';
import { UserForRegisterDTO, User } from '../interfaces/user';
import { TokenOutput } from '../interfaces/token';
import MailerService from './mailer.service';
import config from '../config';

@Service()
export default class AuthService {
  private readonly mailerService: MailerService;

  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
    @Inject('tokenModel') private tokenModel: Models.TokenModel,
  ) {
    this.mailerService = Container.get(MailerService);
  }

  async signUp(userForRegisterDTO: UserForRegisterDTO): Promise<TokenOutput> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password1 } = userForRegisterDTO;

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

    const accessToken = this.generateAccessToken(user);

    const refreshToken = randtoken.uid(80);

    return {
      tokenType: config.tokenType,
      accessToken,
      refreshToken,
      expiresIn: config.AccessTokenLifetime,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  private generateAccessToken(user: User): string {
    console.log(config.secretKey);

    const userData = {
      // eslint-disable-next-line no-underscore-dangle
      _id: user._id,
      username: user.username,
      role: user.role,
    };

    const token = jwt.sign(userData, config.secretKey);

    return token;
  }
}
