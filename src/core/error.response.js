'use strict'

const StatusCode = {
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  BAD_REQUEST: 400,
  CONFLICT: 409,
  NOT_ACCEPTABLE: 406,
}

const ReasonStatusCode = {
  FORBIDDEN: 'Forbidden',
  UNAUTHORIZED: 'Unauthorized',
  NOT_FOUND: 'Not Found',
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  BAD_REQUEST: 'Bad Request',
  CONFLICT: 'Conflict',
  NOT_ACCEPTABLE: 'Not Acceptable',
}


class ErrorResponse extends Error {

  constructor(message, status) {
    super(message)
    this.status = status
  }
}


class ConflictRequestErrorResponse extends ErrorResponse {
  constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.CONFLICT) {
    super(message, statusCode)
  }
}

class UnauthorizedRequestErrorResponse extends ErrorResponse {
  constructor(message = ReasonStatusCode.UNAUTHORIZED, statusCode = StatusCode.UNAUTHORIZED) {
    super(message, statusCode)
  }
}

class ForbiddenRequestErrorResponse extends ErrorResponse {
  constructor(message = ReasonStatusCode.FORBIDDEN, statusCode = StatusCode.FORBIDDEN) {
    super(message, statusCode)
  }
}

class NotFoundRequestErrorResponse extends ErrorResponse {
  constructor(message = ReasonStatusCode.NOT_FOUND, statusCode = StatusCode.NOT_FOUND) {
    super(message, statusCode)
  }
}

class BadRequestRequestErrorResponse extends ErrorResponse {
  constructor(message = ReasonStatusCode.BAD_REQUEST, statusCode = StatusCode.BAD_REQUEST) {
    super(message, statusCode)
  }
}

class NotFoundResponseErrorResponse extends ErrorResponse {
  constructor(message = ReasonStatusCode.NOT_FOUND, statusCode = StatusCode.NOT_FOUND) {
    super(message, statusCode)
  }
}

class InternalServerErrorRequestResponse extends ErrorResponse {
  constructor(message = ReasonStatusCode.INTERNAL_SERVER_ERROR, statusCode = StatusCode.INTERNAL_SERVER_ERROR) {
    super(message, statusCode)
  }
}

class NotAcceptableRequestErrorResponse extends ErrorResponse {
  constructor(message = ReasonStatusCode.NOT_ACCEPTABLE, statusCode = StatusCode.NOT_ACCEPTABLE) {
    super(message, statusCode)
  }
}


module.exports = {
  ConflictRequestErrorResponse,
  UnauthorizedRequestErrorResponse,
  ForbiddenRequestErrorResponse,
  NotFoundRequestErrorResponse,
  BadRequestRequestErrorResponse,
  InternalServerErrorRequestResponse,
  NotAcceptableRequestErrorResponse
}