import { Service, Inject } from 'typedi';
import 'reflect-metadata';
import { NotFoundError } from '../helpers/errors';
import {
  CommentForDetailDTO,
  CommentForCreateDTO,
  CommentPost,
  CommentComment,
} from '../interfaces/comment';

@Service()
export default class CommentService {
  constructor(
    @Inject('commentModel') private commentModel: Models.CommentModel,
    @Inject('postModel') private postModel: Models.PostModel,
    @Inject('userModel') private userModel: Models.UserModel,
  ) {}

  async commentPost(
    commentForCreateDTO: CommentForCreateDTO & CommentPost,
  ): Promise<void> {
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

  async getComment(commentId: string): Promise<CommentForDetailDTO> {
    if (!/^[0-9a-fA-F]{24}$/.exec(commentId)) {
      throw new NotFoundError('Comment not found!');
    }

    const commentFetched = await this.commentModel
      .findById(commentId)
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

    if (!commentFetched) throw new NotFoundError('Comment not found!');

    return commentFetched;
  }

  async commentComment(
    commentForCreateDTO: CommentForCreateDTO & CommentComment,
  ): Promise<void> {
    const commentFetched = await this.commentModel.findById(
      commentForCreateDTO.commentId,
    );

    if (!commentFetched) throw new NotFoundError('Comment not found!');

    const commentCreated = await this.commentModel.create({
      user: commentForCreateDTO.user,
      content: commentForCreateDTO.content,
    });

    commentFetched.comments.unshift(commentCreated);

    await commentFetched.save();
  }

  async deleteComment(commentId: string): Promise<void> {
    if (!/^[0-9a-fA-F]{24}$/.exec(commentId)) {
      throw new NotFoundError('Comment not found!');
    }

    const commentDeleted = await this.commentModel.findByIdAndDelete(commentId);

    if (!commentDeleted) throw new NotFoundError('Comment not found!');
  }

  async likeComment(commentId: string, userId: string): Promise<void> {
    if (!/^[0-9a-fA-F]{24}$/.exec(commentId)) {
      throw new NotFoundError('Comment not found!');
    }
    const commentFetched = await this.commentModel.findById(commentId);

    if (!commentFetched) throw new NotFoundError('Comment not found!');

    if (
      commentFetched.likes.filter((user) => user.toString() === userId)
        .length === 0
    ) {
      const userFetched = await this.userModel.findById(userId);

      if (!userFetched) throw new NotFoundError('User not found!');

      commentFetched.likes.unshift(userFetched);
    } else {
      const removeIndex = commentFetched.likes
        .map((user) => user.toString())
        .indexOf(userId);

      commentFetched.likes.splice(removeIndex, 1);
    }

    await commentFetched.save();
  }
}
