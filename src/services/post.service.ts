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
  constructor(@Inject('postModel') private postModel: Models.PostModel) {}

  async getPosts(): Promise<PostForListDTO[]> {
    const postsFetched = await this.postModel.find({});

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
    // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
    if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new NotFoundError('Post not found!');
    }

    const postFetched = await this.postModel.findById(postId).select('-__v');

    if (!postFetched) throw new NotFoundError('Post not found!');

    return postFetched;
  }

  async createPost(postForCreateDTO: PostForCreateDTO): Promise<void> {
    await this.postModel.create({
      ...postForCreateDTO,
    });
  }

  async deletePost(postId: string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
    if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new NotFoundError('Post not found!');
    }

    const postDeleted = await this.postModel.findByIdAndDelete(postId);

    if (!postDeleted) throw new NotFoundError('Post not found!');

    postDeleted.images.map((image: string) => unlinkSync(`.${image}`));
  }

  async likePost(postId: string, userId: string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
    if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new NotFoundError('Post not found!');
    }

    const postFetched = await this.postModel.findById(postId);

    if (!postFetched) throw new NotFoundError('Post not found!');

    if (
      postFetched.likes.filter(
        ({ user }: { user: string }) => user.toString() === userId,
      ).length === 0
    ) {
      postFetched.likes.unshift({ user: userId });
    } else {
      const removeIndex = postFetched.likes
        .map(({ user }: { user: string }) => user.toString())
        .indexOf(userId);

      postFetched.likes.splice(removeIndex, 1);
    }

    await postFetched.save();
  }
}
