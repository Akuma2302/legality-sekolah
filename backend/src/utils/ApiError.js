/** Lets services throw errors with an HTTP status attached, caught by the error middleware. */
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}
