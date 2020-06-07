import { Service, Inject } from 'typedi';
import 'reflect-metadata';
import {
  Post,
  PostForCreateDTO,
  PostForListDTO,
  PostForDetailDTO,
} from '../interfaces/post';

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

  async createPost(postForCreateDTO: PostForCreateDTO): Promise<void> {
    await this.postModel.create({
      ...postForCreateDTO,
    });
  }
}
