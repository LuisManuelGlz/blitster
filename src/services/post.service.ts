import { Service, Inject } from 'typedi';
import 'reflect-metadata';
import { PostForCreateDTO } from '../interfaces/post';

@Service()
export default class PostService {
  constructor(@Inject('postModel') private postModel: Models.PostModel) {}

  async createPost(postForCreateDTO: PostForCreateDTO): Promise<void> {
    await this.postModel.create({
      ...postForCreateDTO,
    });
  }
}
