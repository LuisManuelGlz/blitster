import { Service, Inject } from 'typedi';
import 'reflect-metadata';
import { NotFoundError } from '../helpers/errors';
import { ProfileForListDTO, ProfileForDetailDTO } from '../interfaces/profile';

@Service()
export default class FollowService {
  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
    @Inject('profileModel') private profileModel: Models.ProfileModel,
  ) {}

  async follow(
    userId: string,
    userToFollowId: string,
  ): Promise<ProfileForListDTO> {
    if (!/^[0-9a-fA-F]{24}$/.exec(userToFollowId)) {
      throw new NotFoundError('User not found!');
    }

    const profileToFollowFetched = await this.profileModel.findOne({
      user: userToFollowId,
    });

    if (!profileToFollowFetched) throw new NotFoundError('User not found!');

    const followerProfileFetched = await this.profileModel.findOne({
      user: userId,
    });

    if (!followerProfileFetched) {
      throw new NotFoundError("Your profile couldn't be found!");
    }

    if (
      profileToFollowFetched.followers.filter(
        (user) => user.toString() === userId,
      ).length === 0
    ) {
      const userFetched = await this.userModel.findById(userId);

      if (!userFetched) throw new NotFoundError('User not found!');

      const userToFollowFetched = await this.userModel.findById(userToFollowId);

      if (!userToFollowFetched) throw new NotFoundError('User not found!');

      profileToFollowFetched.followers.unshift(userFetched);
      followerProfileFetched.following.unshift(userToFollowFetched);
    } else {
      const removeIndex = profileToFollowFetched.followers
        .map((user) => user.toString())
        .indexOf(userId);

      profileToFollowFetched.followers.splice(removeIndex, 1);

      const removeFollowedIndex = followerProfileFetched.followers
        .map((user) => user.toString())
        .indexOf(userToFollowId);

      followerProfileFetched.following.splice(removeFollowedIndex, 1);
    }

    const profile = await profileToFollowFetched.save().then(
      (profileSaved) =>
        // eslint-disable-next-line implicit-arrow-linebreak
        profileSaved
          .populate('user', '_id fullName username avatar')
          .execPopulate(),
      // eslint-disable-next-line function-paren-newline
    );

    await followerProfileFetched.save();

    return {
      _id: profile._id,
      user: profile.user,
      bio: profile.bio,
      followers: profile.followers.length,
      following: profile.following.length,
    };
  }

  async getFollowers(userId: string): Promise<ProfileForDetailDTO> {
    if (!/^[0-9a-fA-F]{24}$/.exec(userId)) {
      throw new NotFoundError('User not found!');
    }

    const profileFetched = await this.profileModel
      .findOne({ user: userId })
      .select('followers')
      .populate({
        path: 'followers',
        model: 'User',
        select: {
          _id: 1,
          fullName: 1,
          username: 1,
          avatar: 1,
        },
      })
      .sort({ createdAt: 'desc' });

    if (!profileFetched) throw new NotFoundError('User not found!');

    return profileFetched;
  }

  async getFollowing(userId: string): Promise<ProfileForDetailDTO> {
    if (!/^[0-9a-fA-F]{24}$/.exec(userId)) {
      throw new NotFoundError('User not found!');
    }

    const profileFetched = await this.profileModel
      .findOne({ user: userId })
      .select('following')
      .populate({
        path: 'following',
        model: 'User',
        select: {
          _id: 1,
          fullName: 1,
          username: 1,
          avatar: 1,
        },
      })
      .sort({ createdAt: 'desc' });

    if (!profileFetched) throw new NotFoundError('User not found!');

    return profileFetched;
  }
}
