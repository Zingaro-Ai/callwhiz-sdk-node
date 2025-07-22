const Joi = require('joi');
const { ValidationError } = require('./exceptions');

/**
 * CallWhiz SDK Data Models and Validation
 */

// Common validation schemas
const id = Joi.string().required();
const phoneNumber = Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required();
const url = Joi.string().uri({ scheme: ['http', 'https'] }).required();

// Agent Models
const AgentSchema = {
  create: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    voice: Joi.object({
      provider: Joi.string().required(),
      voice_id: Joi.string().required(),
      speed: Joi.number().default(1),
      pitch: Joi.number().default(1)
    }).required(),
    llm: Joi.object({
      provider: Joi.string().required(),
      model: Joi.string().required(),
      temperature: Joi.number().default(0.7),
      max_tokens: Joi.number().integer().default(150)
    }).required(),
    prompt: Joi.string().required(),
    first_message: Joi.string().optional(),
    settings: Joi.object({
      max_call_duration: Joi.number().integer().default(1800),
      enable_interruptions: Joi.boolean().default(true),
      silence_timeout: Joi.number().default(5),
      response_delay: Joi.number().default(0.5)
    }).optional()
  }),
  
  update: Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    voice: Joi.object({
      provider: Joi.string(),
      voice_id: Joi.string(),
      speed: Joi.number(),
      pitch: Joi.number()
    }).optional(),
    llm: Joi.object({
      provider: Joi.string(),
      model: Joi.string(),
      temperature: Joi.number(),
      max_tokens: Joi.number().integer()
    }).optional(),
    prompt: Joi.string().optional(),
    first_message: Joi.string().optional(),
    settings: Joi.object({
      max_call_duration: Joi.number().integer(),
      enable_interruptions: Joi.boolean(),
      silence_timeout: Joi.number(),
      response_delay: Joi.number()
    }).optional()
  }).min(1)
};

// Call Models
const CallSchema = {
  create: Joi.object({
    agent_id: id,
    phone_number: phoneNumber,
    metadata: Joi.object().optional()
  })
};

// Webhook Models
const WebhookSchema = {
  create: Joi.object({
    url,
    events: Joi.array().items(Joi.string()).min(1).required(),
    description: Joi.string().optional(),
    metadata: Joi.object().optional()
  }),
  
  update: Joi.object({
    url: url.optional(),
    events: Joi.array().items(Joi.string()).min(1).optional(),
    description: Joi.string().optional(),
    metadata: Joi.object().optional()
  }).min(1)
};

// API Key Models
const ApiKeySchema = {
  create: Joi.object({
    name: Joi.string().required().min(1).max(100),
    description: Joi.string().optional(),
    permissions: Joi.array().items(Joi.string()).optional()
  })
};

/**
 * Validate data against schema
 * @param {Object} data - Data to validate
 * @param {Object} schema - Joi schema
 * @throws {ValidationError} If validation fails
 * @returns {Object} Validated data
 */
function validate(data, schema) {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    const messages = error.details.map(detail => detail.message).join(', ');
    throw new ValidationError(`Validation failed: ${messages}`);
  }
  return value;
}

/**
 * Response Models (for documentation)
 */
class Agent {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.voice = data.voice;
    this.llm = data.llm;
    this.prompt = data.prompt;
    this.description = data.description;
    this.first_message = data.first_message;
    this.settings = data.settings;
    this.metadata = data.metadata;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}

class Call {
  constructor(data) {
    this.id = data.id;
    this.agent_id = data.agent_id;
    this.phone_number = data.phone_number;
    this.status = data.status;
    this.metadata = data.metadata;
    this.created_at = data.created_at;
    this.completed_at = data.completed_at;
  }
}

class Webhook {
  constructor(data) {
    this.id = data.id;
    this.url = data.url;
    this.events = data.events;
    this.description = data.description;
    this.metadata = data.metadata;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}

class ApiKey {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.key = data.key;
    this.description = data.description;
    this.permissions = data.permissions;
    this.created_at = data.created_at;
  }
}

module.exports = {
  // Schemas
  AgentSchema,
  CallSchema,
  WebhookSchema,
  ApiKeySchema,
  
  // Models
  Agent,
  Call,
  Webhook,
  ApiKey,
  
  // Utils
  validate
};