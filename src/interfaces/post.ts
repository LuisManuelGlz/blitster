/**
 * @swagger
 *  components:
 *    schemas:
 *      PostForCreateDTO:
 *        type: object
 *        required:
 *          - content
 *        properties:
 *          content:
 *            type: string
 *            description: Content of post.
 *          images:
 *            type: array
 *            description: Images of post, this property is optional.
 *            items:
 *              type: string
 *              format: binary
 */

import { Document, Types } from 'mongoose';
import { Comment } from './comment';
import { User } from './user';

export interface Post extends Document {
  _id: string;
  user: Types.ObjectId;
  content: string;
  images: string[];
  likes: User[];
  comments: Comment[];
  createdAt: Date;
}

export interface PostForListDTO {
  _id: string;
  user: Types.ObjectId;
  content: string;
  images: string[];
  likes: number;
  comments: number;
  liked: boolean;
  createdAt: Date;
}

export interface PostForCreateDTO {
  user: string;
  content: string;
  images: string[];
}

export interface LikesOfPostDTO {
  likes: User[];
}
