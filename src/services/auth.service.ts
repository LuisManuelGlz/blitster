import { Container, Service, Inject } from 'typedi';
import 'reflect-metadata';
import bcrypt from 'bcrypt';
import cripto from 'crypto';
import jwt from 'jsonwebtoken';
import randtoken from 'rand-token';
import { UserForRegisterDTO, UserForLoginDTO, User } from '../interfaces/user';
import { TokenOutput } from '../interfaces/token';
import MailerService from './mailer.service';
import config from '../config';
import { UnauthorizedError, NotFoundError } from '../helpers/errors';

@Service()
export default class AuthService {
  private readonly mailerService: MailerService;

  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
    @Inject('tokenModel') private tokenModel: Models.TokenModel,
    @Inject('refreshTokenModel') private refreshTokenModel: Models.RefreshToken,
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

    const tokenOutput = this.generateTokenOutput(user);

    await this.refreshTokenModel.create({
      user: userCreated,
      refreshToken: tokenOutput.refreshToken,
    });

    return tokenOutput;
  }

  async login(userForLoginDTO: UserForLoginDTO): Promise<TokenOutput> {
    const { username, password } = userForLoginDTO;

    const userFetched = await this.userModel.findOne({ username });

    if (!userFetched) throw new NotFoundError('User not found!');

    const isValid = bcrypt.compareSync(password, userFetched.passwordHash);

    if (!isValid) throw new UnauthorizedError('Incorrect password');

    const user = userFetched.toObject();

    Reflect.deleteProperty(user, 'passwordHash');

    const tokenOutput = this.generateTokenOutput(user);

    await this.refreshTokenModel.create({
      user: userFetched,
      refreshToken: tokenOutput.refreshToken,
    });

    return tokenOutput;
  }

  // eslint-disable-next-line class-methods-use-this
  private generateTokenOutput(user: User): TokenOutput {
    const userData = {
      // eslint-disable-next-line no-underscore-dangle
      _id: user._id,
      username: user.username,
      role: user.role,
    };

    const accessToken = jwt.sign(userData, config.secretKey);

    const refreshToken = randtoken.uid(80);

    return {
      tokenType: config.tokenType,
      accessToken,
      refreshToken,
      expiresIn: config.AccessTokenLifetime,
    };
  }
}
