/**
 * CallWhiz SDK Test Suite
 * Run individual tests or all tests to verify each function works
 * 
 * Usage:
 * node tests/test-suite.js                    # Run all tests
 * node tests/test-suite.js agents             # Run only agent tests
 * node tests/test-suite.js webhooks           # Run only webhook tests
 * node tests/test-suite.js calls              # Run only call tests
 */

const CallWhiz = require('../callwhiz');
require('dotenv').config();

// Test configuration
const TEST_CONFIG = {
  apiKey: process.env.CALLWHIZ_API_KEY,
  timeout: 30000
};

// Global test data (will be populated during tests)
let testData = {
  agent: null,
  webhook: null,
  call: null
};

class TestRunner {
  constructor() {
    this.client = new CallWhiz(TEST_CONFIG);
    this.passed = 0;
    this.failed = 0;
    this.skipped = 0;
  }

  async runTest(name, testFn, skip = false) {
    if (skip) {
      console.log(`⏭️  SKIP: ${name}`);
      this.skipped++;
      return;
    }

    try {
      console.log(`🧪 Testing: ${name}`);
      const result = await testFn();
      console.log(`✅ PASS: ${name}`);
      if (result) console.log(`   Result:`, JSON.stringify(result, null, 2).substring(0, 200) + '...');
      this.passed++;
      return result;
    } catch (error) {
      console.log(`❌ FAIL: ${name}`);
      console.log(`   Error: ${error.message}`);
      this.failed++;
      throw error;
    }
  }

  printSummary() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Passed: ${this.passed}`);
    console.log(`❌ Failed: ${this.failed}`);
    console.log(`⏭️  Skipped: ${this.skipped}`);
    console.log(`📈 Total: ${this.passed + this.failed + this.skipped}`);
    
    if (this.failed > 0) {
      console.log('\n❗ Some tests failed. Check the logs above for details.');
      process.exit(1);
    } else {
      console.log('\n🎉 All tests passed!');
    }
  }
}

// =================
// AGENT TESTS
// =================

async function testCreateAgent(runner) {
  return runner.runTest('Create Agent', async () => {
    const agent = await runner.client.createAgent({
      name: "Test Agent " + Date.now(),
      description: "Test agent for SDK testing",
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
      prompt: "You are a test agent for SDK testing.",
      first_message: "Hello! This is a test agent.",
      settings: {
        max_call_duration: 1800,
        enable_interruptions: true,
        silence_timeout: 5,
        response_delay: 0.5
      }
    });
    
    testData.agent = agent;
    return { id: agent.id, name: agent.name };
  });
}

async function testGetAgent(runner) {
  return runner.runTest('Get Agent', async () => {
    if (!testData.agent) throw new Error('No agent to test with. Run create agent test first.');
    
    const agent = await runner.client.getAgent(testData.agent.id);
    return { id: agent.id, name: agent.name, status: agent.status };
  });
}

async function testListAgents(runner) {
  return runner.runTest('List Agents', async () => {
    const agents = await runner.client.listAgents({ limit: 5 });
    return { count: agents.length, first_agent: agents[0]?.name };
  });
}

async function testUpdateAgent(runner) {
  return runner.runTest('Update Agent', async () => {
    if (!testData.agent) throw new Error('No agent to test with. Run create agent test first.');
    
    const updatedAgent = await runner.client.updateAgent(testData.agent.id, {
      name: "Updated Test Agent " + Date.now(),
      description: "Updated description for testing"
    });
    
    return { id: updatedAgent.id, name: updatedAgent.name };
  });
}

async function testDeleteAgent(runner) {
  return runner.runTest('Delete Agent', async () => {
    if (!testData.agent) throw new Error('No agent to test with. Run create agent test first.');
    
    const result = await runner.client.deleteAgent(testData.agent.id);
    return { deleted: result };
  }, true); // Skip by default to keep test agent
}

// =================
// WEBHOOK TESTS
// =================

async function testCreateWebhook(runner) {
  return runner.runTest('Create Webhook', async () => {
    const webhook = await runner.client.createWebhook({
      url: 'https://httpbin.org/post',
      events: ['call.started', 'call.completed'],
      agent_ids: testData.agent ? [testData.agent.id] : undefined,
      active: true,
      retry_policy: {
        max_retries: 3,
        retry_delay: 60,
        backoff_multiplier: 2
      }
    });
    
    testData.webhook = webhook;
    return { 
      id: webhook.webhook_id || webhook.id, 
      url: webhook.url,
      events: webhook.events.length 
    };
  });
}

async function testGetWebhook(runner) {
  return runner.runTest('Get Webhook', async () => {
    if (!testData.webhook) throw new Error('No webhook to test with. Run create webhook test first.');
    
    const webhookId = testData.webhook.webhook_id || testData.webhook.id;
    const webhook = await runner.client.getWebhook(webhookId);
    return { id: webhook.webhook_id || webhook.id, active: webhook.active };
  });
}

async function testListWebhooks(runner) {
  return runner.runTest('List Webhooks', async () => {
    const webhooks = await runner.client.listWebhooks();
    return { count: webhooks.length };
  });
}

async function testGetWebhookEvents(runner) {
  return runner.runTest('Get Available Webhook Events', async () => {
    const events = await runner.client.getAvailableWebhookEvents();
    return { available_events: events.length, first_event: events[0] };
  });
}

async function testUpdateWebhook(runner) {
  return runner.runTest('Update Webhook', async () => {
    if (!testData.webhook) throw new Error('No webhook to test with. Run create webhook test first.');
    
    const webhookId = testData.webhook.webhook_id || testData.webhook.id;
    const updatedWebhook = await runner.client.updateWebhook(webhookId, {
      active: false
    });
    
    return { id: updatedWebhook.webhook_id || updatedWebhook.id, active: updatedWebhook.active };
  });
}

async function testDeleteWebhook(runner) {
  return runner.runTest('Delete Webhook', async () => {
    if (!testData.webhook) throw new Error('No webhook to test with. Run create webhook test first.');
    
    const webhookId = testData.webhook.webhook_id || testData.webhook.id;
    const result = await runner.client.deleteWebhook(webhookId);
    return { deleted: result };
  }, true); // Skip by default to keep test webhook
}

// =================
// CALL TESTS (Commented out as they require actual phone calls)
// =================

async function testStartCall(runner) {
  return runner.runTest('Start Call', async () => {
    if (!testData.agent) throw new Error('No agent to test with. Run create agent test first.');
    
    // NOTE: This will initiate an actual call!
    const call = await runner.client.startCall({
      agent_id: testData.agent.id,
      phone_number: '+1234567890', // REPLACE WITH ACTUAL TEST NUMBER
      context: {
        customer_name: 'Test Customer',
        purpose: 'SDK Testing'
      },
      metadata: {
        test: true,
        timestamp: new Date().toISOString()
      }
    });
    
    testData.call = call;
    return { id: call.id, status: call.status };
  }, true); // Skip by default as it makes actual calls
}

async function testGetCall(runner) {
  return runner.runTest('Get Call', async () => {
    if (!testData.call) throw new Error('No call to test with. Run start call test first.');
    
    const call = await runner.client.getCall(testData.call.id);
    return { id: call.id, status: call.status };
  }, true); // Skip by default
}

async function testListCalls(runner) {
  return runner.runTest('List Calls', async () => {
    const calls = await runner.client.listCalls({ limit: 5 });
    return { count: calls.length };
  });
}

async function testGetCallTranscript(runner) {
  return runner.runTest('Get Call Transcript', async () => {
    if (!testData.call) throw new Error('No call to test with. Run start call test first.');
    
    const transcript = await runner.client.getCallTranscript(testData.call.id);
    return { call_id: transcript.call_id };
  }, true); // Skip by default
}

// =================
// ANALYTICS TESTS
// =================

async function testGetUsage(runner) {
  return runner.runTest('Get Usage', async () => {
    const usage = await runner.client.getUsage({ period: 'month' });
    return { period: usage.period };
  });
}

async function testGetCreditBalance(runner) {
  return runner.runTest('Get Credit Balance', async () => {
    const balance = await runner.client.getCreditBalance();
    return { credits: balance.credits || 'unknown' };
  });
}

async function testGetAccountLimits(runner) {
  return runner.runTest('Get Account Limits', async () => {
    const limits = await runner.client.getAccountLimits();
    return { rate_limit: limits.rate_limit || 'unknown' };
  });
}

// =================
// CONVERSATION TESTS
// =================

async function testListConversations(runner) {
  return runner.runTest('List Conversations', async () => {
    const conversations = await runner.client.listConversations({ limit: 5 });
    return { count: conversations.length };
  });
}

// =================
// TEST SUITES
// =================

const TEST_SUITES = {
  agents: [
    testCreateAgent,
    testGetAgent,
    testListAgents,
    testUpdateAgent,
    testDeleteAgent
  ],
  webhooks: [
    testCreateWebhook,
    testGetWebhook,
    testListWebhooks,
    testGetWebhookEvents,
    testUpdateWebhook,
    testDeleteWebhook
  ],
  calls: [
    testListCalls,
    testStartCall,
    testGetCall,
    testGetCallTranscript
  ],
  analytics: [
    testGetUsage,
    testGetCreditBalance,
    testGetAccountLimits
  ],
  conversations: [
    testListConversations
  ]
};

// =================
// MAIN TEST RUNNER
// =================

async function runTests() {
  if (!process.env.CALLWHIZ_API_KEY) {
    console.log('❌ CALLWHIZ_API_KEY environment variable is required');
    console.log('💡 Set it with: export CALLWHIZ_API_KEY=your_api_key_here');
    process.exit(1);
  }

  const runner = new TestRunner();
  const targetSuite = process.argv[2];

  console.log('🚀 CallWhiz SDK Test Suite');
  console.log('='.repeat(50));
  
  if (targetSuite && TEST_SUITES[targetSuite]) {
    console.log(`📋 Running ${targetSuite} tests only\n`);
    
    for (const testFn of TEST_SUITES[targetSuite]) {
      try {
        await testFn(runner);
      } catch (error) {
        // Continue with other tests even if one fails
        continue;
      }
    }
  } else {
    console.log('📋 Running all tests\n');
    
    // Run tests in order
    const allTests = [
      ...TEST_SUITES.agents,
      ...TEST_SUITES.webhooks,
      ...TEST_SUITES.calls,
      ...TEST_SUITES.analytics,
      ...TEST_SUITES.conversations
    ];
    
    for (const testFn of allTests) {
      try {
        await testFn(runner);
      } catch (error) {
        // Continue with other tests even if one fails
        continue;
      }
    }
  }

  runner.printSummary();
}

// =================
// UTILITY FUNCTIONS
// =================

function validateEnvironment() {
  if (!process.env.CALLWHIZ_API_KEY) {
    console.error('❌ Missing CALLWHIZ_API_KEY environment variable');
    console.error('💡 Get your API key from: https://dashboard.callwhiz.ai');
    console.error('💡 Set it with: export CALLWHIZ_API_KEY=your_api_key_here');
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  validateEnvironment();
  runTests().catch(console.error);
}

module.exports = { runTests, TEST_SUITES };