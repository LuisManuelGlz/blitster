import HttpError from './httpError.helper';

export default class BadRequestError extends HttpError {
  constructor(message = 'Internal server error') {
    super(500, message);
    this.message = message;
  }
}
