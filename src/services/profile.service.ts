import { Service, Inject } from 'typedi';
import 'reflect-metadata';
import { NotFoundError } from '../helpers/errors';
import { ProfileForListDTO } from '../interfaces/profile';

@Service()
export default class ProfileService {
  constructor(
    @Inject('profileModel') private profileModel: Models.ProfileModel,
  ) {}

  async getMyProfile(userId: string): Promise<ProfileForListDTO> {
    const profileFetched = await this.profileModel
      .findOne({ user: userId })
      .populate('user', '_id username fullName avatar email');

    if (!profileFetched) throw new NotFoundError('User not found!');

    return {
      _id: profileFetched._id,
      user: profileFetched.user,
      bio: profileFetched.bio,
      followers: profileFetched.followers.length,
      following: profileFetched.following.length,
    };
  }

  async getProfile(userId: string): Promise<ProfileForListDTO> {
    if (!/^[0-9a-fA-F]{24}$/.exec(userId)) {
      throw new NotFoundError('User not found!');
    }

    const profileFetched = await this.profileModel
      .findOne({ user: userId })
      .populate('user', '_id fullName username avatar');

    if (!profileFetched) throw new NotFoundError('User not found!');

    return {
      _id: profileFetched._id,
      user: profileFetched.user,
      bio: profileFetched.bio,
      followers: profileFetched.followers.length,
      following: profileFetched.following.length,
    };
  }
}
