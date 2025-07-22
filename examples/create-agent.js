const CallWhiz = require('./callwhiz');
require('dotenv').config();


const client = new CallWhiz({
  apiKey: process.env.CALLWHIZ_API_KEY
});

async function createAgentExample() {
  try {
    // Option 1: Basic agent creation (minimum required fields)
    console.log('🤖 Creating basic agent...');
    const basicAgent = await client.create_agent({
      name: "Basic Support Agent",
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
      prompt: "You are a helpful customer support agent."
    });
    
    console.log('✅ Basic agent created:');
    console.log(`   ID: ${basicAgent.id}`);
    console.log(`   Name: ${basicAgent.name}`);
    console.log(`   Status: ${basicAgent.status}`);
    
    // Option 2: Full agent creation (all available fields)
    console.log('\n🚀 Creating full-featured agent...');
    const fullAgent = await client.create_agent({
      name: "Premium Customer Support Agent",
      description: "Advanced AI agent with comprehensive customer support capabilities",
      voice: {
        provider: "openai",
        voice_id: "nova",
        speed: 1.1,
        pitch: 1.0
      },
      llm: {
        provider: "openai",
        model: "gpt-4",
        temperature: 0.8,
        max_tokens: 200
      },
      prompt: `You are an expert customer support agent for CallWhiz. 
               Be friendly, professional, and always helpful. 
               Ask clarifying questions when needed.
               Escalate complex issues to human agents when appropriate.`,
      first_message: "Hello! Welcome to CallWhiz support. I'm here to help you with any questions or issues. How can I assist you today?",
      settings: {
        max_call_duration: 2400,     // 40 minutes
        enable_interruptions: true,   // Allow users to interrupt
        silence_timeout: 8,          // Wait 8 seconds for response
        response_delay: 0.3          // Quick response time
      }
    });
    
    console.log('✅ Full agent created:');
    console.log(`   ID: ${fullAgent.id}`);
    console.log(`   Name: ${fullAgent.name}`);
    console.log(`   Description: ${fullAgent.description}`);
    console.log(`   Voice: ${fullAgent.voice.provider} - ${fullAgent.voice.voice_id}`);
    console.log(`   LLM: ${fullAgent.llm.provider} - ${fullAgent.llm.model}`);
    
  } catch (error) {
    console.error('❌ Error creating agent:', error.message);
  }
}


createAgentExample()