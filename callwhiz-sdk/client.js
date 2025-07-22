const axios = require('axios');
const crypto = require('crypto');
const { 
  AuthenticationError, 
  ValidationError, 
  RateLimitError, 
  APIError 
} = require('./exceptions');
const { 
  AgentSchema, 
  CallSchema, 
  WebhookSchema, 
  ApiKeySchema,
  validate 
} = require('./models');

/**
 * CallWhiz API Client - Complete Version (Matches Python)
 */
class CallWhiz {
  constructor(options = {}) {
    if (!options.apiKey) {
      throw new ValidationError('API key is required');
    }

    this.apiKey = options.apiKey;
    this.baseURL = options.baseURL || 'http://localhost:8000/v1/api/developer/v1';
    this.timeout = options.timeout || 30000;

    // Setup HTTP client
    this.http = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json'
      }
    });

    // Setup response interceptor for error handling
    this.http.interceptors.response.use(
      response => response,
      error => this._handleError(error)
    );
  }

  /**
   * Make HTTP request with proper error handling and data extraction
   * @private
   */
  async _request(method, endpoint, config = {}) {
    const response = await this.http.request({
      method,
      url: endpoint,
      ...config
    });

    const data = response.data;
    if (!data.success) {
      throw new APIError(data.error?.message || 'Unknown error');
    }

    return data.data;
  }

  // =================
  // AGENT METHODS - COMPLETE
  // =================

  /**
   * Create a new voice agent with all available fields
   */
  async create_agent({
    name,
    voice,
    llm,
    prompt,
    description = null,
    first_message = null,
    settings = null
  }) {
    const data = {
      name,
      voice,
      llm,
      prompt
    };

    if (description !== null) data.description = description;
    if (first_message !== null) data.first_message = first_message;
    if (settings !== null) data.settings = settings;

    // Validate data before sending
    const validData = validate(data, AgentSchema.create);
    return this._request('POST', '/agents', { data: validData });
  }

  /**
   * Get agent by ID
   */
  async get_agent(agent_id) {
    if (!agent_id) throw new ValidationError('Agent ID is required');
    return this._request('GET', `/agents/${agent_id}`);
  }

  /**
   * List all agents
   */
  async list_agents({
    page = 1,
    limit = 20,
    status = null
  } = {}) {
    const params = { page, limit };
    if (status) params.status = status;

    return this._request('GET', '/agents', { params });
  }

  /**
   * Update agent with any fields
   */
  async update_agent(agent_id, {
    name = null,
    description = null,
    voice = null,
    llm = null,
    prompt = null,
    first_message = null,
    settings = null,
    status = null
  } = {}) {
    if (!agent_id) throw new ValidationError('Agent ID is required');

    const data = {};
    if (name !== null) data.name = name;
    if (description !== null) data.description = description;
    if (voice !== null) data.voice = voice;
    if (llm !== null) data.llm = llm;
    if (prompt !== null) data.prompt = prompt;
    if (first_message !== null) data.first_message = first_message;
    if (settings !== null) data.settings = settings;
    if (status !== null) data.status = status;

    // Validate data before sending
    const validData = validate(data, AgentSchema.update);
    return this._request('PUT', `/agents/${agent_id}`, { data: validData });
  }

  /**
   * Delete agent (soft delete - becomes inactive)
   */
  async delete_agent(agent_id) {
    if (!agent_id) throw new ValidationError('Agent ID is required');
    await this._request('DELETE', `/agents/${agent_id}`);
    return true;
  }

  // =================
  // CALL METHODS - COMPLETE
  // =================

  /**
   * Initiate a call with all available fields
   */
  async start_call({
    agent_id,
    phone_number,
    context = null,
    webhook_url = null,
    metadata = null
  }) {
    const data = {
      agent_id,
      phone_number
    };

    if (context !== null) data.context = context;
    if (webhook_url !== null) data.webhook_url = webhook_url;
    if (metadata !== null) data.metadata = metadata;

    // Validate data before sending
    const validData = validate(data, CallSchema.create);
    return this._request('POST', '/calls', { data: validData });
  }

  /**
   * Get call status and details
   */
  async get_call(call_id) {
    if (!call_id) throw new ValidationError('Call ID is required');
    return this._request('GET', `/calls/${call_id}`);
  }

  /**
   * List calls with filters
   */
  async list_calls({
    page = 1,
    limit = 20,
    agent_id = null,
    status = null,
    from_date = null,
    to_date = null
  } = {}) {
    const params = { page, limit };
    if (agent_id) params.agent_id = agent_id;
    if (status) params.status = status;
    if (from_date) params.from_date = from_date;
    if (to_date) params.to_date = to_date;

    return this._request('GET', '/calls', { params });
  }

  /**
   * Get call transcript
   */
  async get_call_transcript(call_id) {
    if (!call_id) throw new ValidationError('Call ID is required');
    return this._request('GET', `/calls/${call_id}/transcript`);
  }

  /**
   * Get call recording URL
   */
  async get_call_recording(call_id) {
    if (!call_id) throw new ValidationError('Call ID is required');
    return this._request('GET', `/calls/${call_id}/recording`);
  }

  // =================
  // WEBHOOK METHODS - COMPLETE
  // =================

  /**
   * Create webhook with all available fields
   */
  async create_webhook({
    url,
    events,
    agent_ids = null,
    active = true,
    retry_policy = null,
    headers = null
  }) {
    const data = {
      url,
      events,
      active
    };

    if (agent_ids !== null) data.agent_ids = agent_ids;
    if (retry_policy !== null) data.retry_policy = retry_policy;
    if (headers !== null) data.headers = headers;

    // Validate data before sending
    const validData = validate(data, WebhookSchema.create);
    return this._request('POST', '/webhooks', { data: validData });
  }

  /**
   * List all webhooks
   */
  async list_webhooks() {
    return this._request('GET', '/webhooks');
  }

  /**
   * Get webhook by ID
   */
  async get_webhook(webhook_id) {
    if (!webhook_id) throw new ValidationError('Webhook ID is required');
    return this._request('GET', `/webhooks/${webhook_id}`);
  }

  /**
   * Update webhook configuration
   */
  async update_webhook(webhook_id, {
    url = null,
    events = null,
    agent_ids = null,
    active = null,
    retry_policy = null,
    headers = null
  } = {}) {
    if (!webhook_id) throw new ValidationError('Webhook ID is required');

    const data = {};
    if (url !== null) data.url = url;
    if (events !== null) data.events = events;
    if (agent_ids !== null) data.agent_ids = agent_ids;
    if (active !== null) data.active = active;
    if (retry_policy !== null) data.retry_policy = retry_policy;
    if (headers !== null) data.headers = headers;

    // Validate data before sending
    const validData = validate(data, WebhookSchema.update);
    return this._request('PUT', `/webhooks/${webhook_id}`, { data: validData });
  }

  /**
   * Delete webhook
   */
  async delete_webhook(webhook_id) {
    if (!webhook_id) throw new ValidationError('Webhook ID is required');
    await this._request('DELETE', `/webhooks/${webhook_id}`);
    return true;
  }

  /**
   * Get list of all available webhook events
   */
  async get_available_webhook_events() {
    return this._request('GET', '/webhooks/events');
  }

  // =================
  // CONVERSATION METHODS
  // =================

  /**
   * List conversation history
   */
  async list_conversations({
    agent_id = null,
    page = 1,
    limit = 20,
    from_date = null,
    to_date = null
  } = {}) {
    const params = { page, limit };
    if (agent_id) params.agent_id = agent_id;
    if (from_date) params.from_date = from_date;
    if (to_date) params.to_date = to_date;

    return this._request('GET', '/conversations', { params });
  }

  /**
   * Get detailed conversation data
   */
  async get_conversation(conversation_id) {
    if (!conversation_id) throw new ValidationError('Conversation ID is required');
    return this._request('GET', `/conversations/${conversation_id}`);
  }

  // =================
  // USAGE & ANALYTICS
  // =================

  /**
   * Get API usage statistics
   */
  async get_usage({
    period = 'month',
    from_date = null,
    to_date = null
  } = {}) {
    const params = { period };
    if (from_date) params.from_date = from_date;
    if (to_date) params.to_date = to_date;

    return this._request('GET', '/usage', { params });
  }

  /**
   * Get current credit balance
   */
  async get_credit_balance() {
    return this._request('GET', '/usage/credits');
  }

  /**
   * Get account limits and quotas
   */
  async get_account_limits() {
    return this._request('GET', '/usage/limits');
  }

  // =================
  // API KEY METHODS
  // =================

  /**
   * Create a new API key
   */
  async create_api_key(data) {
    const validData = validate(data, ApiKeySchema.create);
    return this._request('POST', '/api-keys', { data: validData });
  }

  /**
   * List all API keys
   */
  async list_api_keys() {
    return this._request('GET', '/api-keys');
  }

  // =================
  // WEBHOOK UTILITIES
  // =================

  /**
   * Verify webhook signature (static method)
   */
  static verifyWebhookSignature(payload, signature, secret) {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    return 'sha256=' + expectedSignature === signature;
  }

  // =================
  // SESSION MANAGEMENT
  // =================

  /**
   * Close the HTTP session (matches Python's close())
   */
  close() {
    this.http = null;
  }

  // =================
  // ERROR HANDLING
  // =================

  /**
   * Handle HTTP errors (matches Python error handling)
   * @private
   */
  _handleError(error) {
    if (error.response) {
      const { status, data } = error.response;
      const message = data?.error?.message || data?.message || error.message;

      switch (status) {
        case 401:
          throw new AuthenticationError('Invalid API key');
        case 404:
          throw new APIError('Resource not found', status);
        case 400:
        case 422:
          throw new ValidationError(message);
        case 429:
          throw new RateLimitError('Rate limit exceeded');
        default:
          throw new APIError(`HTTP ${status}: ${message}`, status, data);
      }
    }

    // Network or other errors
    throw new APIError(`Request failed: ${error.message}`);
  }
}

module.exports = CallWhiz;