/**
 * @swagger
 *  components:
 *    schemas:
 *      UserForRegisterDTO:
 *        type: object
 *        required:
 *          - fullName
 *          - username
 *          - email
 *          - password1
 *          - password2
 *        properties:
 *          fullName:
 *            type: string
 *            description: Full name to use for register.
 *          username:
 *            type: string
 *            description: Username to use for register, needs to be unique.
 *          email:
 *            type: string
 *            format: email
 *            description: Email to use for register, needs to be unique.
 *          password1:
 *            type: string
 *            minimum: 8
 *            description: Password to use for register, needs to have 8 characters or more.
 *          password2:
 *            type: string
 *            minimum: 8
 *            description: Password to use for register, needs to be the same to password1.
 *      UserForLoginDTO:
 *        type: object
 *        required:
 *          - username
 *          - password
 *        properties:
 *          username:
 *            type: string
 *            description: Username to use for login.
 *          password:
 *            type: string
 *            description: Password to use for login.
 */

import { Document } from 'mongoose';

export interface User extends Document {
  _id: string;
  fullName: string;
  email: string;
  username: string;
  profile: string;
  role: string;
  passwordHash: string;
  avatar: string;
  isVerified: boolean;
}

export interface UserForRegisterDTO {
  fullName: string;
  email: string;
  username: string;
  password1: string;
  password2: string;
}

export interface UserForLoginDTO {
  username: string;
  password: string;
}

export interface UserForListDTO {
  _id: string;
  fullName: string;
  username: string;
  avatar: string;
  profile: string;
}

export interface UserForDetailDTO {
  _id: string;
  fullName: string;
  username: string;
  avatar: string;
  profile: string;
}

export interface AccountForUpdateDTO {
  newEmail: string;
  newFullName: string;
  newUsername: string;
}
