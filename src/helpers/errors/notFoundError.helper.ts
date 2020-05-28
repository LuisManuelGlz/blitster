import HttpError from './httpError.helper';

export default class NotFoundError extends HttpError {
  constructor(message = 'Not found!') {
    super(404, message);
    this.message = message;
  }
}
