const CallWhiz = require('../callwhiz-sdk');
require('dotenv').config();



const client = new CallWhiz({
  apiKey: process.env.CALLWHIZ_API_KEY
});

async function listAgentsExample() {
  try {
    // Option 1: List all agents (default pagination)
    console.log('📋 Listing all agents...');
    const allAgents = await client.list_agents();
    
    console.log(`✅ Found ${allAgents.length} agents`);
    allAgents.forEach((agent, index) => {
      console.log(`${index + 1}. ${agent.name} (${agent.id}) - Status: ${agent.status}`);
    });
    
    // Option 2: List with pagination
    console.log('\n📄 Listing agents with pagination...');
    const paginatedAgents = await client.list_agents({
      page: 1,
      limit: 5
    });
    
    console.log(`✅ Page 1 - Showing 5 agents:`);
    paginatedAgents.forEach(agent => {
      console.log(`- ${agent.name} (Created: ${new Date(agent.created_at).toLocaleDateString()})`);
    });
    
    // Option 3: Filter by status
    console.log('\n🟢 Listing only active agents...');
    const activeAgents = await client.list_agents({
      status: "active"
    });
    
    console.log(`✅ Found ${activeAgents.length} active agents`);
    activeAgents.forEach(agent => {
      console.log(`- ${agent.name} - Voice: ${agent.voice?.voice_id}, Model: ${agent.llm?.model}`);
    });
    
    // Option 4: Detailed agent information
    console.log('\n📖 Detailed agent information...');
    for (const agent of allAgents.slice(0, 2)) { // Just show first 2 for brevity
      console.log(`\n🤖 Agent: ${agent.name}`);
      console.log(`   ID: ${agent.id}`);
      console.log(`   Status: ${agent.status}`);
      console.log(`   Description: ${agent.description || 'No description'}`);
      console.log(`   Voice: ${agent.voice?.provider} - ${agent.voice?.voice_id}`);
      console.log(`   LLM: ${agent.llm?.provider} - ${agent.llm?.model}`);
      console.log(`   Created: ${new Date(agent.created_at).toLocaleString()}`);
      console.log(`   Updated: ${new Date(agent.updated_at).toLocaleString()}`);
    }
    
  } catch (error) {
    console.error('❌ Error listing agents:', error.message);
  }
}

listAgentsExample()