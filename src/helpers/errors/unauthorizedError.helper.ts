import HttpError from './httpError.helper';

export default class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized') {
    super(401, message);
    this.message = message;
  }
}
