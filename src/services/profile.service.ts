import { Service, Inject } from 'typedi';
import 'reflect-metadata';
import { NotFoundError } from '../helpers/errors';
import { ProfileForDetailDTO } from '../interfaces/profile';

@Service()
export default class ProfileService {
  constructor(
    @Inject('profileModel') private profileModel: Models.ProfileModel,
  ) {}

  async getMyProfile(userId: string): Promise<ProfileForDetailDTO> {
    console.log(userId);
    const profileFetched = await this.profileModel
      .findOne({ user: userId })
      .populate('user', '_id username fullName email');

    if (!profileFetched) throw new NotFoundError('Profile not found!');

    return profileFetched;
  }

  async getProfile(userId: string): Promise<ProfileForDetailDTO> {
    if (!/^[0-9a-fA-F]{24}$/.exec(userId)) {
      throw new NotFoundError('User not found!');
    }

    const userFetched = await this.profileModel
      .findById(userId)
      .populate('user', '_id fullName username');

    if (!userFetched) throw new NotFoundError('Profile not found!');

    return userFetched;
  }
}
