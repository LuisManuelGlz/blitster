import { Service, Inject } from 'typedi';
import 'reflect-metadata';
import { NotFoundError } from '../helpers/errors';
import { CommentForCreateDTO } from '../interfaces/comment';

@Service()
export default class CommentService {
  constructor(
    @Inject('commentModel') private commentModel: Models.CommentModel,
    @Inject('postModel') private postModel: Models.PostModel,
  ) {}

  async commentPost(commentForCreateDTO: CommentForCreateDTO): Promise<void> {
    const postFetched = await this.postModel.findById(
      commentForCreateDTO.postId,
    );

    if (!postFetched) throw new NotFoundError('Post not found!');

    const commentCreated = await this.commentModel.create({
      user: commentForCreateDTO.user,
      content: commentForCreateDTO.content,
    });

    postFetched.comments.unshift(commentCreated);

    await postFetched.save();
  }

  async deleteComment(commentId: string): Promise<void> {
    if (!/^[0-9a-fA-F]{24}$/.exec(commentId)) {
      throw new NotFoundError('Comment not found!');
    }

    const commentDeleted = await this.postModel.findByIdAndDelete(commentId);

    if (!commentDeleted) throw new NotFoundError('Comment not found!');
  }
}
