// test-local.js - Test your generator locally before deploying

const fs = require('fs');
const path = require('path');

// Load environment variables from .env file if it exists
if (fs.existsSync('.env')) {
  const envFile = fs.readFileSync('.env', 'utf8');
  envFile.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
}

// Import your Lambda function
const { handler } = require('./index.js');

async function testLocally() {
  console.log('🧪 Testing Gibsongen Lambda locally...\n');
  
  // Check environment variables
  if (!process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN) {
    console.error('❌ AIRTABLE_PERSONAL_ACCESS_TOKEN not found!');
    console.log('💡 Create a .env file with: AIRTABLE_PERSONAL_ACCESS_TOKEN=your_token_here');
    process.exit(1);
  }
  
  console.log('✅ Environment variables loaded');
  console.log('🔑 Airtable Personal Access Token found:', process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN.substring(0, 8) + '...');
  
  try {
    // Mock Lambda event and context
    const event = {
      source: 'test',
      time: new Date().toISOString()
    };
    
    const context = {
      functionName: 'gibsongen-lambda-test',
      remainingTimeInMillis: () => 120000 // 2 minutes
    };
    
    console.log('\n🚀 Running generator...');
    const result = await handler(event, context);
    
    console.log('\n📊 Result:');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.statusCode === 200) {
      console.log('\n🎉 Test completed successfully!');
      console.log('✅ Ready for AWS Lambda deployment');
    } else {
      console.log('\n❌ Test failed');
      console.log('💡 Check the error message above');
    }
    
  } catch (error) {
    console.error('\n💥 Test failed with error:', error.message);
    console.error('📍 Stack trace:', error.stack);
  }
}

// Run the test
testLocally();