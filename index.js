const GibsonGenerator = require('./gibson-generator');
const Airtable = require('airtable');

// Configure Airtable
const base = new Airtable({
  apiKey: process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN
}).base(process.env.AIRTABLE_BASE_ID); // Your Gibson Art Generator base ID

const DAILY_BATCHES_TABLE = 'Daily Batches';
const GIBSON_PROMPTS_TABLE = 'Gibson Prompts';

class GibsongenLambda {
  
  async generateGibsonText() {
    console.log('🤖 Generating Gibsongen text locally...');
    
    try {
      const generator = new GibsonGenerator();
      
      // Generate 4 cyberpunk paragraphs
      const paragraphs = generator.generateText(4);
      
      console.log(`📝 Generated ${paragraphs.length} paragraphs`);
      
      // Log preview of generated content
      paragraphs.forEach((paragraph, index) => {
        console.log(`📝 Paragraph ${index + 1}: ${paragraph.substring(0, 100)}...`);
      });
      
      return paragraphs;
      
    } catch (error) {
      console.error('❌ Text generation failed:', error.message);
      throw error;
    }
  }

  async createDailyBatch() {
    console.log('📅 Creating daily batch record...');
    
    const today = new Date().toISOString().split('T')[0];
    
    try {
      const record = await base(DAILY_BATCHES_TABLE).create({
        'Date': today,
        'Status': 'Pending',
        'Notes': `Lambda batch created at ${new Date().toISOString()}`
      });

      console.log(`✅ Created batch record: ${record.getId()}`);
      return record.getId();
    } catch (error) {
      console.error('❌ Failed to create batch:', error.message);
      throw error;
    }
  }

  async createGibsonPrompts(paragraphs, batchId) {
    console.log('💭 Creating Gibsongen prompt records...');
    
    const promptRecords = paragraphs.map((text, index) => ({
      fields: {
        'Generated Text': text,
        'Prompt Number': index + 1,
        'Status': 'Pending',
        'Batch': [batchId]
      }
    }));

    try {
      const records = await base(GIBSON_PROMPTS_TABLE).create(promptRecords);
      console.log(`✅ Created ${records.length} prompt records`);
      
      // Update batch status
      await base(DAILY_BATCHES_TABLE).update(batchId, {
        'Status': 'Text Generated'
      });
      
      return records.map(r => r.getId());
    } catch (error) {
      console.error('❌ Failed to create prompts:', error.message);
      throw error;
    }
  }

  async checkIfAlreadyScrapedToday() {
    const today = new Date().toISOString().split('T')[0];
    
    try {
      const records = await base(DAILY_BATCHES_TABLE)
        .select({
          filterByFormula: `{Date} = '${today}'`,
          maxRecords: 1
        })
        .firstPage();
      
      return records.length > 0;
    } catch (error) {
      console.error('❌ Failed to check existing records:', error.message);
      return false;
    }
  }

  async run() {
    console.log('🚀 Lambda Gibsongen generation starting...');
    
    try {
      // Check if already generated today
      const alreadyGenerated = await this.checkIfAlreadyScrapedToday();
      if (alreadyGenerated) {
        console.log('⏭️ Already generated today, skipping...');
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Already generated today' })
        };
      }

      // Generate Gibsongen text locally
      const paragraphs = await this.generateGibsonText();
      
      // Create batch record
      const batchId = await this.createDailyBatch();
      
      // Create prompt records
      const promptIds = await this.createGibsonPrompts(paragraphs, batchId);
      
      console.log('🎉 Lambda generation completed successfully!');
      
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Generation completed successfully',
          batchId: batchId,
          promptIds: promptIds,
          paragraphCount: paragraphs.length,
          preview: paragraphs.map(p => p.substring(0, 100) + '...')
        })
      };
      
    } catch (error) {
      console.error('💥 Lambda generation failed:', error.message);
      
      // Try to log error to Airtable
      try {
        const today = new Date().toISOString().split('T')[0];
        await base(DAILY_BATCHES_TABLE).create({
          'Date': today,
          'Status': 'Pending', // Use existing status
          'Notes': `Lambda text generation failed: ${error.message}`
        });
      } catch (logError) {
        console.error('Failed to log error to Airtable:', logError.message);
      }
      
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Text generation failed',
          message: error.message
        })
      };
    }
  }
}

// Lambda handler function
exports.handler = async (event, context) => {
  console.log('🏁 Lambda function triggered:', JSON.stringify(event, null, 2));
  const lambda = new GibsongenLambda();
  return await lambda.run();
};

// For testing locally
if (require.main === module) {
  const lambda = new GibsongenLambda();
  lambda.run().then(result => {
    console.log('Test result:', result);
  });
}