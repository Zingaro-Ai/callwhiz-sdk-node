/**
 * CallWhiz SDK - Main Entry Point
 */

const CallWhiz = require('./client');
const {
  CallWhizError,
  AuthenticationError,
  ValidationError,
  RateLimitError,
  APIError
} = require('./exceptions');
const {
  Agent,
  Call,
  Webhook,
  ApiKey
} = require('./models');

// Default export - the main client
module.exports = CallWhiz;

// Named exports for advanced usage
module.exports.CallWhiz = CallWhiz;
module.exports.errors = {
  CallWhizError,
  AuthenticationError,
  ValidationError,
  RateLimitError,
  APIError
};
module.exports.models = {
  Agent,
  Call,
  Webhook,
  ApiKey
};