import HttpError from './httpError.helper';

export default class BadRequestError extends HttpError {
  constructor(message = 'Bad request') {
    super(400, message);
    this.message = message;
  }
}
