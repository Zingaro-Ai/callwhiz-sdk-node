/**
 * Test Configuration
 * Enable/disable specific tests and configure test parameters
 */

module.exports = {
  // API Configuration
  api: {
    baseURL: 'http://localhost:8000/v1/api/developer/v1',
    timeout: 30000
  },

  // Test Control - Set to false to skip tests
  tests: {
    agents: {
      create: true,
      get: true,
      list: true,
      update: true,
      delete: false  // Keep test agents by default
    },
    webhooks: {
      create: true,
      get: true,
      list: true,
      update: true,
      delete: false,  // Keep test webhooks by default
      getEvents: true
    },
    calls: {
      start: false,   // Disabled by default - makes real calls!
      get: false,
      list: true,
      transcript: false,
      recording: false
    },
    analytics: {
      usage: true,
      credits: true,
      limits: true
    },
    conversations: {
      list: true,
      get: false
    }
  },

  // Test Data Templates
  testData: {
    agent: {
      name: "SDK Test Agent",
      description: "Agent created by SDK test suite",
      voice: {
        provider: "openai",
        voice_id: "alloy",
        speed: 1.0,
        pitch: 1.0
      },
      llm: {
        provider: "openai",
        model: "gpt-4",
        temperature: 0.7,
        max_tokens: 150
      },
      prompt: "You are a helpful test agent created by the SDK test suite.",
      first_message: "Hello! I'm a test agent. How can I help you?",
      settings: {
        max_call_duration: 1800,
        enable_interruptions: true,
        silence_timeout: 5,
        response_delay: 0.5
      }
    },

    webhook: {
      url: 'https://httpbin.org/post',  // Safe test URL
      events: ['call.started', 'call.completed', 'call.failed'],
      active: true,
      retry_policy: {
        max_retries: 3,
        retry_delay: 60,
        backoff_multiplier: 2
      }
    },

    call: {
      phone_number: '+1234567890',  // ⚠️ REPLACE WITH ACTUAL TEST NUMBER
      context: {
        customer_name: 'Test Customer',
        customer_id: 'test_123',
        purpose: 'SDK Testing'
      },
      metadata: {
        test: true,
        suite: 'sdk-test'
      }
    }
  },

  // Test Parameters
  limits: {
    listLimit: 5,        // Default limit for list operations
    maxRetries: 3,       // Retry failed tests
    retryDelay: 1000     // Delay between retries (ms)
  },

  // Logging Configuration
  logging: {
    verbose: true,       // Show detailed test output
    showResponses: false, // Show API response data
    maxResponseLength: 200 // Truncate long responses
  }
};