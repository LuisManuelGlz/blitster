import { Service, Inject } from 'typedi';
import 'reflect-metadata';
import {
  User,
  UserForListDTO,
  UserForDetailDTO,
  AccountForUpdateDTO,
} from '../interfaces/user';
import { NotFoundError, BadRequestError } from '../helpers/errors';

@Service()
export default class UserService {
  constructor(@Inject('userModel') private userModel: Models.UserModel) {}

  async getUsers(): Promise<UserForListDTO[]> {
    const usersFetched = await this.userModel
      .find({})
      .sort({ createdAt: 'desc' });

    return usersFetched.map((user: User) => ({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      avatar: user.avatar,
    }));
  }

  async getUser(userId: string): Promise<UserForDetailDTO> {
    if (!/^[0-9a-fA-F]{24}$/.exec(userId)) {
      throw new NotFoundError('User not found!');
    }

    const userFetched = await this.userModel
      .findById(userId)
      .select('_id fullName username avatar');

    if (!userFetched) throw new NotFoundError('User not found!');

    return userFetched;
  }

  async getProfile(userId: string): Promise<UserForDetailDTO> {
    const userFetched = await this.userModel
      .findById(userId)
      .select('_id fullName username avatar email');

    if (!userFetched) throw new NotFoundError('User not found!');

    return userFetched;
  }

  async updateAccount(
    userId: string,
    userUsername: string,
    userEmail: string,
    accountForUpdateDTO: AccountForUpdateDTO,
  ): Promise<UserForDetailDTO> {
    const { newEmail, newFullName, newUsername } = accountForUpdateDTO;

    console.log(userUsername);
    console.log(newUsername);
    if (userUsername !== newUsername) {
      const user = await this.userModel.findOne({ username: newUsername });
      if (user) throw new BadRequestError('Username already exists');
    }

    if (userEmail !== newEmail) {
      const user = await this.userModel.findOne({ email: newEmail });
      if (user) throw new BadRequestError('Email already exists');
    }

    await this.userModel.findByIdAndUpdate(userId, {
      fullName: newFullName,
      username: newUsername,
      email: newEmail,
    });

    const userFetched = await this.userModel
      .findById(userId)
      .select('_id fullName username avatar');

    if (!userFetched) throw new NotFoundError('User not found!');

    return userFetched;
  }
}
