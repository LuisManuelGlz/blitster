import { Container, Service, Inject } from 'typedi';
import 'reflect-metadata';
import bcrypt from 'bcrypt';
import randtoken from 'rand-token';
import { UserForRegisterDTO, UserForLoginDTO } from '../interfaces/user';
import {
  RefreshTokenForTokenDTO,
  TokenOutput,
} from '../interfaces/refreshToken';
import MailerService from './mailer.service';
import config from '../config';
import { UnauthorizedError, NotFoundError } from '../helpers/errors';
import JwtService from './jwt.service';

@Service()
export default class AuthService {
  private readonly mailerService: MailerService;

  private readonly jwtServiceToken: JwtService;

  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
    @Inject('profileModel') private profileModel: Models.ProfileModel,
    @Inject('tokenModel') private tokenModel: Models.TokenModel,
    @Inject('refreshTokenModel')
    private refreshTokenModel: Models.RefreshTokenModel,
  ) {
    this.mailerService = Container.get(MailerService);
    this.jwtServiceToken = Container.get(JwtService);
  }

  async signUp(userForRegisterDTO: UserForRegisterDTO): Promise<TokenOutput> {
    const { password1 } = userForRegisterDTO;
    const salt = bcrypt.genSaltSync();
    const passwordHash = bcrypt.hashSync(password1, salt);
    const profileCreated = await this.profileModel.create({});
    console.log(profileCreated);
    const userCreated = await this.userModel.create({
      ...userForRegisterDTO,
      profile: profileCreated,
      passwordHash,
    });
    const verificationToken = randtoken.uid(32);

    await this.tokenModel.create({
      user: userCreated,
      verificationToken,
    });
    this.mailerService.SendEmail(userCreated.email, verificationToken);
    const user = userCreated.toObject();
    Reflect.deleteProperty(user, 'passwordHash');

    const accessToken = this.jwtServiceToken.generateAccessToken(user);
    const refreshToken = this.jwtServiceToken.generateRefreshToken();

    await this.refreshTokenModel.create({
      user: userCreated,
      refreshToken,
    });

    return {
      tokenType: config.tokenType,
      accessToken,
      refreshToken,
      expiresIn: config.AccessTokenLifetime,
    };
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

    const accessToken = this.jwtServiceToken.generateAccessToken(user);
    const refreshToken = this.jwtServiceToken.generateRefreshToken();

    await this.refreshTokenModel.create({
      user: userFetched,
      refreshToken,
    });

    return {
      tokenType: config.tokenType,
      accessToken,
      refreshToken,
      expiresIn: config.AccessTokenLifetime,
    };
  }

  async verifyEmail(verificationToken: string): Promise<void> {
    const verificationTokenFetched = await this.tokenModel.findOne({
      verificationToken,
    });

    if (!verificationTokenFetched) {
      throw new NotFoundError('Verification token not found!');
    }

    await this.userModel.findByIdAndUpdate(verificationTokenFetched.user, {
      isVerified: true,
    });
  }

  async refresh(
    refreshTokenForTokenDTO: RefreshTokenForTokenDTO,
  ): Promise<TokenOutput> {
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

      const accessToken = this.jwtServiceToken.generateAccessToken(userFetched);

      await this.refreshTokenModel.findByIdAndUpdate(refreshTokenFetched._id, {
        refreshToken: accessToken,
      });

      return {
        tokenType: config.tokenType,
        accessToken,
        expiresIn: config.AccessTokenLifetime,
      };
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
}
