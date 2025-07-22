/**
 * CallWhiz SDK Custom Exceptions
 */

class CallWhizError extends Error {
  constructor(message, statusCode = null) {
    super(message);
    this.name = 'CallWhizError';
    this.statusCode = statusCode;
  }
}

class AuthenticationError extends CallWhizError {
  constructor(message = 'Invalid API key') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

class ValidationError extends CallWhizError {
  constructor(message = 'Invalid request data') {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

class RateLimitError extends CallWhizError {
  constructor(message = 'Rate limit exceeded', retryAfter = null) {
    super(message, 429);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

class APIError extends CallWhizError {
  constructor(message, statusCode, response = null) {
    super(message, statusCode);
    this.name = 'APIError';
    this.response = response;
  }
}

module.exports = {
  CallWhizError,
  AuthenticationError,
  ValidationError,
  RateLimitError,
  APIError
};