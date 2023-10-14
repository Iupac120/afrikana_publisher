class CustomError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.name = this.constructor.name;
    }
  }
  
  class NotFoundError extends CustomError {
    constructor(message = 'Resource not found') {
      super(message, 404);
    }
  }
  
  class BadRequestError extends CustomError {
    constructor(message = 'Bad request') {
      super(message, 400);
    }
  }

  class UnAuthorizedError extends CustomError {
    constructor(message = 'Unauthorized') {
      super(message, 401);
    }
  }
  