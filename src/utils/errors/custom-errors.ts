interface StatusCode {
  OK: number;
  CREATED: number;
  BAD_REQUEST: number;
  UN_AUTHORIZED: number;
  NOT_FOUND: number;
  INTERNAL_ERROR: number;
}

const STATUS_CODE: StatusCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UN_AUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

interface MessageAndStatus {
  message: string;
  statusCode?: number;
}

class AppError extends Error {
  message: string;
  statusCode: number;
  constructor({ message, statusCode }: MessageAndStatus) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}

class ApiError extends AppError {
  constructor({
    message = "something bad happen -- try again later",
    statusCode = STATUS_CODE.INTERNAL_ERROR,
  }: MessageAndStatus) {
    super({ message, statusCode });
  }
}

class BadRequest extends AppError {
  constructor({
    message = "bad request",
    statusCode = STATUS_CODE.BAD_REQUEST,
  }: MessageAndStatus) {
    super({ message, statusCode });
  }
}

class UnAuthorized extends AppError {
  constructor({
    message = "unauthorized",
    statusCode = STATUS_CODE.UN_AUTHORIZED,
  }: MessageAndStatus) {
    super({ message, statusCode });
  }
}

class NotFound extends AppError {
  constructor({
    message = "not found",
    statusCode = STATUS_CODE.NOT_FOUND,
  }: MessageAndStatus) {
    super({ message, statusCode });
  }
}

export { AppError, BadRequest, NotFound, UnAuthorized, ApiError, STATUS_CODE };
