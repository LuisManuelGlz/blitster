import { Service, Inject } from 'typedi';
import 'reflect-metadata';
import { User, UserForListDTO, UserForDetailDTO } from '../interfaces/user';
import { NotFoundError } from '../helpers/errors';

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
}