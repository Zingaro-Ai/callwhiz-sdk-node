/**
 * CallWhiz SDK - Production Quickstart Example
 * 
 * Prerequisites:
 * 1. Set CALLWHIZ_API_KEY environment variable
 * 2. Install dependencies: npm install
 * 
 * Usage: node examples/quickstart.js
 */

const CallWhiz = require('../callwhiz-sdk');
require('dotenv').config();

// Production configuration
const client = new CallWhiz({   
  apiKey: process.env.CALLWHIZ_API_KEY
});

async function main() {
  try {
    console.log('🚀 CallWhiz SDK Production Example\n');

    // 1. Create a customer service agent with all fields
    console.log('📞 Creating customer service agent...');
    const agent = await client.create_agent({
      name: "Customer Support Agent",
      description: "AI agent that handles customer support inquiries",
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
      prompt: "You are a helpful customer support agent for CallWhiz.",
      first_message: "Hello! Welcome to CallWhiz support. How can I help you today?",
      settings: {
        max_call_duration: 1800,
        enable_interruptions: true,
        silence_timeout: 5,
        response_delay: 0.5
      }
    });
    console.log(`✅ Agent created: ${agent.id}\n`);

    // 2. Set up webhook for call events
    console.log('🔗 Setting up webhook...');
    // const webhook = await client.create_webhook({
    //   url: 'https://your-domain.com/webhooks/callwhiz',
    //   events: [
    //     'call.started',
    //     'call.completed',
    //     'call.failed',
    //     'call.transcript_ready'
    //   ],
    //   agent_ids: [agent.id],
    //   active: true,
    //   retry_policy: {
    //     max_retries: 3,
    //     retry_delay: 60,
    //     backoff_multiplier: 2
    //   }
    // });
    // console.log(`✅ Webhook created: ${webhook.webhook_id || webhook.id}`);
    // console.log(`🔐 Webhook secret: ${webhook.secret || 'hidden'}\n`);

    // 3. List recent calls
    // console.log('📋 Fetching recent calls...');
    // const calls = await client.list_calls({
    //   limit: 5
    // });
    // console.log(`✅ Found ${calls?.length || 0} recent calls\n`);

    // 4. List all agents
    console.log('👥 Fetching all agents...');
    const agents = await client.list_agents();
    console.log(`✅ Total agents: ${agents?.length || 0}\n`);

    // 5. Get available webhook events
    // console.log('📡 Getting available webhook events...');
    // const events = await client.get_available_webhook_events();
    // console.log(`✅ Available events: ${events?.length || 0}\n`);

    // 6. Example: Start a call (uncomment for real testing)
    /*
    console.log('📱 Starting a test call...');
    const call = await client.start_call({
      agent_id: agent.id,
      phone_number: '+1234567890', // Replace with actual test number
      context: {
        customer_name: 'John Doe',
        customer_id: 'cust_12345',
        purpose: 'Support inquiry'
      },
      metadata: {
        campaign: 'quickstart_test',
        priority: 'normal'
      }
    });
    console.log(`✅ Call started: ${call.id}`);
    console.log(`📊 Call status: ${call.status}\n`);
    */

    // 7. Get usage statistics
    console.log('📊 Getting usage statistics...');
    const usage = await client.get_usage({ period: 'month' });
    console.log(`✅ Usage data retrieved for current month\n`);

    console.log('🎉 Quickstart completed successfully!');

  } catch (error) {
    console.error('❌ Error occurred:');
    
    if (error.name === 'AuthenticationError') {
      console.error('🔑 Authentication failed. Check your API key.');
      console.error('💡 Set CALLWHIZ_API_KEY environment variable');
    } else if (error.name === 'ValidationError') {
      console.error('📝 Validation error:', error.message);
    } else if (error.name === 'RateLimitError') {
      console.error('⏰ Rate limit exceeded. Try again later.');
      if (error.retryAfter) {
        console.error(`🕐 Retry after: ${error.retryAfter} seconds`);
      }
    } else {
      console.error('🚨 Unexpected error:', error.message);
    }
    
    process.exit(1);
  }
}

// Production webhook handler example
// function createWebhookHandler() {
//   const express = require('express');
//   const app = express();
  
//   app.use(express.json());

//   app.post('/webhooks/callwhiz', (req, res) => {
//     try {
//       // Verify webhook signature in production
//       const signature = req.headers['x-callwhiz-signature'];
//       const payload = JSON.stringify(req.body);
//       const secret = process.env.CALLWHIZ_WEBHOOK_SECRET;
      
//       if (!CallWhiz.verifyWebhookSignature(payload, signature, secret)) {
//         return res.status(401).json({ error: 'Invalid signature' });
//       }

//       // Process webhook event
//       const { type, data } = req.body;
//       console.log(`📡 Webhook received: ${type}`);
      
//       switch (type) {
//         case 'call.completed':
//           console.log(`✅ Call ${data.id} completed successfully`);
//           // Add your business logic here
//           break;
          
//         case 'call.failed':
//           console.log(`❌ Call ${data.id} failed: ${data.failure_reason}`);
//           // Handle call failure
//           break;
          
//         case 'call.transcript_ready':
//           console.log(`📄 Transcript ready for call ${data.call_id}`);
//           // Process transcript
//           break;
//       }

//       res.status(200).json({ received: true });
      
//     } catch (error) {
//       console.error('Webhook error:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });

//   return app;
// }

// Environment validation
function validateEnvironment() {
  if (!process.env.CALLWHIZ_API_KEY) {
    console.error('❌ Missing CALLWHIZ_API_KEY environment variable');
    console.error('💡 Get your API key from: https://dashboard.callwhiz.ai');
    console.error('💡 Set it with: export CALLWHIZ_API_KEY=your_api_key_here');
    process.exit(1);
  }
}

// Run the example
if (require.main === module) {
  validateEnvironment();
  main();
}