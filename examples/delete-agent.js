const CallWhiz = require('../callwhiz-sdk');
require('dotenv').config();


const client = new CallWhiz({
  apiKey: process.env.CALLWHIZ_API_KEY
});

async function deleteAgentExample() {
  try {
    // Option 1: Delete a specific agent by ID
    const agentId = "bc20125b-b5f7-4844-beca-19915dc1f7f6"; // Replace with actual agent ID
    const result = await client.delete_agent(agentId);
    
    console.log('✅ Agent deleted successfully:', result);
    
    // Option 2: Find and delete an agent by name
    const agents = await client.list_agents();
    const agentToDelete = agents.find(agent => agent.name === "Test Agent");
    
    if (agentToDelete) {
      await client.delete_agent(agentToDelete.id);
      console.log('✅ Found and deleted agent:', agentToDelete.name);
    } else {
      console.log('❌ Agent not found');
    }
    
  } catch (error) {
    console.error('❌ Error deleting agent:', error.message);
  }
}

// Run the example
deleteAgentExample();