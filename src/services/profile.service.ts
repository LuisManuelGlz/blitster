import { Service, Inject } from 'typedi';
import 'reflect-metadata';
import { NotFoundError } from '../helpers/errors';
import { UserForListDTO } from '../interfaces/user';

@Service()
export default class ProfileService {
  constructor(
    @Inject('profileModel') private profileModel: Models.ProfileModel,
    @Inject('userModel') private userModel: Models.UserModel,
  ) {}

  async getMyProfile(userId: string): Promise<UserForListDTO> {
    const userFetched = await this.userModel
      .findById(userId)
      .select('_id username fullName avatar email')
      .populate({
        path: 'profile',
        model: 'Profile',
        select: {
          _id: 1,
          bio: 1,
          followers: 1,
          following: 1,
        },
        populate: [
          {
            path: 'followers',
            model: 'User',
            select: {
              _id: 1,
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
          {
            path: 'following',
            model: 'User',
            select: {
              _id: 1,
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      });

    if (!userFetched) throw new NotFoundError('User not found!');

    return {
      _id: userFetched._id,
      fullName: userFetched.fullName,
      username: userFetched.username,
      avatar: userFetched.avatar,
      profile: userFetched.profile,
    };
  }

  async getProfile(userId: string): Promise<UserForListDTO> {
    if (!/^[0-9a-fA-F]{24}$/.exec(userId)) {
      throw new NotFoundError('User not found!');
    }

    const userFetched = await this.userModel
      .findById(userId)
      .select('_id username fullName avatar email')
      .populate({
        path: 'profile',
        model: 'Profile',
        select: {
          _id: 1,
          bio: 1,
          followers: 1,
          following: 1,
        },
        populate: [
          {
            path: 'followers',
            model: 'User',
            select: {
              _id: 1,
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
          {
            path: 'following',
            model: 'User',
            select: {
              _id: 1,
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      });

    if (!userFetched) throw new NotFoundError('User not found!');

    return {
      _id: userFetched._id,
      fullName: userFetched.fullName,
      username: userFetched.username,
      avatar: userFetched.avatar,
      profile: userFetched.profile,
    };
  }
}
