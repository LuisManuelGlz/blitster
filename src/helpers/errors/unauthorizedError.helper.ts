import HttpError from './httpError.helper';

export default class UnauthorizedError extends HttpError {
  constructor() {
    super(401, 'Unauthorized');
  }
}
