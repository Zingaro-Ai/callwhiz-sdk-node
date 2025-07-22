const CallWhiz = require('../callwhiz-sdk');
require('dotenv').config();


const client = new CallWhiz({
  apiKey: process.env.CALLWHIZ_API_KEY
});

async function updateAgentExample() {
  try {
    const agentId = "1463fa42-dcfd-40eb-b353-87a0ee635414"; // Replace with actual agent ID
    
    // Option 1: Update basic info
    console.log('📝 Updating agent basic info...');
    const updatedAgent = await client.update_agent(agentId, {
      name: "Updated Via Node Js",
      description: "Updated AI agent with new capabilities"
    });
    console.log('✅ Agent updated:', updatedAgent.name);
    
    // Option 2: Update voice settings
    console.log('🗣️ Updating voice settings...');
    await client.update_agent(agentId, {
      voice: {
        provider: "openai",
        voice_id: "nova", // Change voice
        speed: 1.2,       // Speak faster
        pitch: 1.1        // Slightly higher pitch
      }
    });
    console.log('✅ Voice settings updated');
    
    // Option 3: Update LLM configuration
    console.log('🧠 Updating LLM settings...');
    await client.update_agent(agentId, {
      llm: {
        provider: "openai",
        model: "gpt-4", 
        temperature: 0.5,  // More focused responses
        max_tokens: 200    // Longer responses
      }
    });
    console.log('✅ LLM settings updated');
    
    // Option 4: Update prompt and behavior
    console.log('💭 Updating prompt and behavior...');
    await client.update_agent(agentId, {
      prompt: "You are an expert customer support agent. Be friendly, helpful, and always ask clarifying questions.",
      first_message: "Hello! I'm here to help you with any questions. What can I assist you with today?",
      settings: {
        max_call_duration: 2400, // 40 minutes
        enable_interruptions: true,
        silence_timeout: 8,       // Wait longer for response
        response_delay: 0.3       // Respond faster
      }
    });
    console.log('✅ Prompt and behavior updated');
    
    // Option 5: Update status (activate/deactivate)
    console.log('🔄 Updating agent status...');
    await client.update_agent(agentId, {
      status: "active" // or "inactive", "draft"
    });
    console.log('✅ Agent status updated');
    
  } catch (error) {
    console.error('❌ Error updating agent:', error.message);
  }
}

updateAgentExample()