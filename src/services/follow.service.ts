import { Service, Inject } from 'typedi';
import 'reflect-metadata';
import { NotFoundError } from '../helpers/errors';
import { UserForListDTO } from '../interfaces/user';

@Service()
export default class FollowService {
  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
    @Inject('profileModel') private profileModel: Models.ProfileModel,
  ) {}

  async follow(
    userId: string,
    userToFollowId: string,
  ): Promise<UserForListDTO> {
    if (!/^[0-9a-fA-F]{24}$/.exec(userToFollowId)) {
      throw new NotFoundError('User not found!');
    }

    const userToFollowFetched = await this.userModel.findById(userToFollowId);

    if (!userToFollowFetched) throw new NotFoundError('User not found!');

    const userToFollowProfileFetched = await this.profileModel.findById(
      userToFollowFetched.profile,
    );

    if (!userToFollowProfileFetched) {
      throw new NotFoundError('Profile not found!');
    }

    const followerFetched = await this.userModel.findById(userId);

    if (!followerFetched) {
      throw new NotFoundError("Your user account couldn't be found!");
    }

    const followerProfileFetched = await this.profileModel.findById(
      followerFetched.profile,
    );

    if (!followerProfileFetched) {
      throw new NotFoundError("Your profile couldn't be found!");
    }

    if (
      userToFollowProfileFetched.followers.filter(
        (user) => user.toString() === userId,
      ).length === 0
    ) {
      userToFollowProfileFetched.followers.unshift(followerFetched);
      followerProfileFetched.following.unshift(userToFollowFetched);
    } else {
      const removeIndex = userToFollowProfileFetched.followers
        .map((user) => user.toString())
        .indexOf(userId);

      userToFollowProfileFetched.followers.splice(removeIndex, 1);

      const removeFollowedIndex = followerProfileFetched.followers
        .map((user) => user.toString())
        .indexOf(userToFollowId);

      followerProfileFetched.following.splice(removeFollowedIndex, 1);
    }

    await userToFollowProfileFetched.save();
    await followerProfileFetched.save();

    const userFetched = await this.userModel
      .findById(userToFollowId)
      .select('_id username fullName avatar')
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

  async getFollowers(userId: string): Promise<UserForListDTO> {
    if (!/^[0-9a-fA-F]{24}$/.exec(userId)) {
      throw new NotFoundError('User not found!');
    }

    const userFetched = await this.userModel
      .findById(userId)
      .select('_id')
      .populate({
        path: 'profile',
        model: 'Profile',
        select: {
          _id: 1,
          followers: 1,
        },
        populate: {
          path: 'followers',
          model: 'User',
          select: {
            _id: 1,
            fullName: 1,
            username: 1,
            avatar: 1,
          },
        },
      });

    if (!userFetched) throw new NotFoundError('User not found!');

    return userFetched;
  }

  async getFollowing(userId: string): Promise<UserForListDTO> {
    if (!/^[0-9a-fA-F]{24}$/.exec(userId)) {
      throw new NotFoundError('User not found!');
    }

    const userFetched = await this.userModel
      .findById(userId)
      .select('_id')
      .populate({
        path: 'profile',
        model: 'Profile',
        select: {
          _id: 1,
          following: 1,
        },
        populate: {
          path: 'following',
          model: 'User',
          select: {
            _id: 1,
            fullName: 1,
            username: 1,
            avatar: 1,
          },
        },
      });

    if (!userFetched) throw new NotFoundError('User not found!');

    return userFetched;
  }
}
