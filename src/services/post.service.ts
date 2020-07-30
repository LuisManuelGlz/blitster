import { Service, Inject } from 'typedi';
import 'reflect-metadata';
import { unlinkSync } from 'fs';
import {
  Post,
  PostForCreateDTO,
  PostForListDTO,
  PostForDetailDTO,
} from '../interfaces/post';
import { NotFoundError } from '../helpers/errors';

@Service()
export default class PostService {
  constructor(
    @Inject('postModel') private postModel: Models.PostModel,
    @Inject('userModel') private userModel: Models.UserModel,
  ) {}

  async getPosts(): Promise<PostForListDTO[]> {
    const postsFetched = await this.postModel
      .find({})
      .populate('user', ['_id', 'fullName', 'username', 'avatar']);

    return postsFetched.map((post: Post) => ({
      _id: post._id,
      user: post.user,
      content: post.content,
      images: post.images,
      likes: post.likes.length,
      comments: post.comments.length,
      createdAt: post.createdAt,
    }));
  }

  async getPost(postId: string): Promise<PostForDetailDTO> {
    if (!/^[0-9a-fA-F]{24}$/.exec(postId)) {
      throw new NotFoundError('Post not found!');
    }

    const postFetched = await this.postModel
      .findById(postId)
      .populate('user', ['_id', 'username', 'avatar'])
      .populate('likes', ['_id', 'username', 'avatar'])
      .populate({
        path: 'comments',
        model: 'Comment',
        populate: [
          {
            path: 'user',
            model: 'User',
            select: { _id: 1, username: 1, avatar: 1 },
          },
          {
            path: 'likes',
            model: 'User',
            select: { _id: 1, username: 1, avatar: 1 },
          },
        ],
      });

    if (!postFetched) throw new NotFoundError('Post not found!');

    return postFetched;
  }

  async createPost(postForCreateDTO: PostForCreateDTO): Promise<void> {
    await this.postModel.create({
      ...postForCreateDTO,
    });
  }

  async deletePost(postId: string): Promise<void> {
    if (!/^[0-9a-fA-F]{24}$/.exec(postId)) {
      throw new NotFoundError('Post not found!');
    }

    const postDeleted = await this.postModel.findByIdAndDelete(postId);

    if (!postDeleted) throw new NotFoundError('Post not found!');

    postDeleted.images.map((image: string) => unlinkSync(`.${image}`));
  }

  async likePost(postId: string, userId: string): Promise<void> {
    if (!/^[0-9a-fA-F]{24}$/.exec(postId)) {
      throw new NotFoundError('Post not found!');
    }

    const postFetched = await this.postModel.findById(postId);

    if (!postFetched) throw new NotFoundError('Post not found!');

    if (
      postFetched.likes.filter((user) => user.toString() === userId).length ===
      0
    ) {
      const userFetched = await this.userModel.findById(userId);

      if (!userFetched) throw new NotFoundError('User not found!');

      postFetched.likes.unshift(userFetched);
    } else {
      const removeIndex = postFetched.likes
        .map((user) => user.toString())
        .indexOf(userId);

      postFetched.likes.splice(removeIndex, 1);
    }

    await postFetched.save();
  }
}
