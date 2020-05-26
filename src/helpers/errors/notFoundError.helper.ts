import HttpError from './httpError.helper';

export default class NotFoundError extends HttpError {
  constructor() {
    super(404, 'Not found!');
  }
}
