import { Container, Service, Inject } from 'typedi';
import 'reflect-metadata';
import bcrypt from 'bcrypt';
import cripto from 'crypto';
import jwt from 'jsonwebtoken';
import randtoken from 'rand-token';
import { UserForRegisterDTO, UserForLoginDTO, User } from '../interfaces/user';
import { TokenOutput, AccessTokenOutput } from '../interfaces/token';
import { RefreshTokenForTokenDTO } from '../interfaces/refreshToken';
import MailerService from './mailer.service';
import config from '../config';
import { UnauthorizedError, NotFoundError } from '../helpers/errors';

@Service()
export default class AuthService {
  private readonly mailerService: MailerService;

  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
    @Inject('tokenModel') private tokenModel: Models.TokenModel,
    @Inject('refreshTokenModel')
    private refreshTokenModel: Models.RefreshTokenModel,
  ) {
    this.mailerService = Container.get(MailerService);
  }

  async signUp(userForRegisterDTO: UserForRegisterDTO): Promise<TokenOutput> {
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
    const isPasswordValid = bcrypt.compareSync(
      password,
      userFetched.passwordHash,
    );
    if (!isPasswordValid) throw new UnauthorizedError('Incorrect password');
    const user = userFetched.toObject();
    Reflect.deleteProperty(user, 'passwordHash');
    const tokenOutput = this.generateTokenOutput(user);
    await this.refreshTokenModel.create({
      user: userFetched,
      refreshToken: tokenOutput.refreshToken,
    });

    return tokenOutput;
  }

  async refresh(
    refreshTokenForTokenDTO: RefreshTokenForTokenDTO,
  ): Promise<AccessTokenOutput> {
    const { userId, refreshToken } = refreshTokenForTokenDTO;
    const refreshTokenFetched = await this.refreshTokenModel.findOne({
      refreshToken,
    });
    if (!refreshTokenFetched) {
      throw new UnauthorizedError("Refresh token doesn't exist");
    }
    if (refreshTokenFetched.user.toString() === userId) {
      const userFetched = await this.userModel.findById(userId);
      if (!userFetched) throw new NotFoundError('User not found!');
      const accessTokenOutput = this.generateAccessTokenOutput(userFetched);
      await this.refreshTokenModel.findByIdAndUpdate(refreshTokenFetched._id, {
        refreshToken: accessTokenOutput.accessToken,
      });

      return accessTokenOutput;
    }

    throw new UnauthorizedError();
  }

  async revoke(refreshToken: string): Promise<void> {
    const refreshTokenDeleted = await this.refreshTokenModel.findOneAndDelete({
      refreshToken,
    });
    if (!refreshTokenDeleted) {
      throw new UnauthorizedError("Refresh token doesn't exist");
    }
  }

  private generateTokenOutput(user: User): TokenOutput {
    const userData = {
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

  private generateAccessTokenOutput(user: User): AccessTokenOutput {
    const userData = {
      _id: user._id,
      username: user.username,
      role: user.role,
    };
    const accessToken = jwt.sign(userData, config.secretKey);

    return {
      tokenType: config.tokenType,
      accessToken,
      expiresIn: config.AccessTokenLifetime,
    };
  }
}
