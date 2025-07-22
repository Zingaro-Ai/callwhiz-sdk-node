/**
 * Quick Test Runner - Test individual SDK functions
 * 
 * Uncomment the functions you want to test and run:
 * node tests/quick-test.js
 */

const CallWhiz = require('../callwhiz-sdk');
require('dotenv').config();

const client = new CallWhiz({
  apiKey: process.env.CALLWHIZ_API_KEY
});

// Test data storage
let testAgent = null;
let testWebhook = null;
let testCall = null;

async function quickTest() {
  console.log('🧪 CallWhiz SDK Quick Test\n');

  try {
    // =================
    // AGENT TESTS
    // =================
    
    // ✅ Test: Create Agent
    console.log('📞 Testing: Create Agent');
    testAgent = await client.createAgent({
      name: "Quick Test Agent",
      description: "Agent for quick testing",
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
      prompt: "You are a helpful test agent.",
      first_message: "Hello! I'm your test agent.",
      settings: {
        max_call_duration: 1800,
        enable_interruptions: true,
        silence_timeout: 5,
        response_delay: 0.5
      }
    });
    console.log('✅ Agent created:', testAgent.id, '\n');

    // ✅ Test: Get Agent
    // console.log('📞 Testing: Get Agent');
    // const agent = await client.getAgent(testAgent.id);
    // console.log('✅ Agent retrieved:', agent.name, '\n');

    // ✅ Test: List Agents
    console.log('📞 Testing: List Agents');
    const agents = await client.listAgents({ limit: 3 });
    console.log('✅ Found agents:', agents.length, '\n');

    // ✅ Test: Update Agent
    // console.log('📞 Testing: Update Agent');
    // const updatedAgent = await client.updateAgent(testAgent.id, {
    //   name: "Updated Quick Test Agent",
    //   description: "Updated description"
    // });
    // console.log('✅ Agent updated:', updatedAgent.name, '\n');

    // =================
    // WEBHOOK TESTS
    // =================

    // ✅ Test: Create Webhook
    console.log('🔗 Testing: Create Webhook');
    testWebhook = await client.createWebhook({
      url: 'https://httpbin.org/post',
      events: ['call.started', 'call.completed'],
      agent_ids: [testAgent.id],
      active: true,
      retry_policy: {
        max_retries: 3,
        retry_delay: 60
      }
    });
    console.log('✅ Webhook created:', testWebhook.webhook_id || testWebhook.id, '\n');

    // ✅ Test: List Webhooks
    // console.log('🔗 Testing: List Webhooks');
    // const webhooks = await client.listWebhooks();
    // console.log('✅ Found webhooks:', webhooks.length, '\n');

    // ✅ Test: Get Available Webhook Events
    console.log('🔗 Testing: Get Available Webhook Events');
    const events = await client.getAvailableWebhookEvents();
    console.log('✅ Available events:', events.length, '\n');

    // =================
    // CALL TESTS (Careful - these make real calls!)
    // =================

    // ⚠️ Test: Start Call (UNCOMMENT ONLY IF YOU WANT TO MAKE A REAL CALL)
    // console.log('📱 Testing: Start Call');
    // testCall = await client.startCall({
    //   agent_id: testAgent.id,
    //   phone_number: '+1234567890', // REPLACE WITH YOUR TEST NUMBER
    //   context: {
    //     customer_name: 'Test Customer',
    //     purpose: 'Quick SDK Test'
    //   }
    // });
    // console.log('✅ Call started:', testCall.id, '\n');

    // ✅ Test: List Calls
    console.log('📱 Testing: List Calls');
    const calls = await client.listCalls({ limit: 3 });
    console.log('✅ Found calls:', calls.length, '\n');

    // =================
    // ANALYTICS TESTS
    // =================

    // ✅ Test: Get Usage
    // console.log('📊 Testing: Get Usage');
    // const usage = await client.getUsage({ period: 'month' });
    // console.log('✅ Usage data retrieved\n');

    // ✅ Test: Get Credit Balance
    // console.log('💰 Testing: Get Credit Balance');
    // const balance = await client.getCreditBalance();
    // console.log('✅ Credit balance retrieved\n');

    // =================
    // CONVERSATION TESTS
    // =================

    // ✅ Test: List Conversations
    // console.log('💬 Testing: List Conversations');
    // const conversations = await client.listConversations({ limit: 3 });
    // console.log('✅ Found conversations:', conversations.length, '\n');

    // =================
    // CLEANUP (Optional)
    // =================

    // 🗑️ Test: Delete Webhook (Uncomment to clean up)
    // if (testWebhook) {
    //   console.log('🗑️ Cleaning up: Delete Webhook');
    //   await client.deleteWebhook(testWebhook.webhook_id || testWebhook.id);
    //   console.log('✅ Webhook deleted\n');
    // }

    // 🗑️ Test: Delete Agent (Uncomment to clean up)
    // if (testAgent) {
    //   console.log('🗑️ Cleaning up: Delete Agent');
    //   await client.deleteAgent(testAgent.id);
    //   console.log('✅ Agent deleted\n');
    // }

    console.log('🎉 Quick test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response?.data) {
      console.error('API Error Details:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

// Environment validation
if (!process.env.CALLWHIZ_API_KEY) {
  console.error('❌ CALLWHIZ_API_KEY environment variable is required');
  console.error('💡 Set it with: export CALLWHIZ_API_KEY=your_api_key_here');
  process.exit(1);
}

// Run the test
quickTest();