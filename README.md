# 🤖 Gibsongen Lambda - AWS Lambda Deployment

A general-purpose cyberpunk-style text generator that stores its output in Airtable. Runs on AWS Lambda and can be scheduled or triggered as needed.

## 🎯 What This Does

- **Local text generation** using advanced cyberpunk vocabulary (no web scraping!)
- **Airtable integration** - stores generated text in your Airtable base
- **AWS Lambda** - serverless, $0/month on free tier
- **Scheduled runs** - can be triggered automatically or manually
- **Customizable vocabulary** - easily expand or modify the cyberpunk terms

## 📁 Project Structure

```
gibsongen-lambda/
├── index.js                 # Main Lambda function
├── gibson-generator.js      # Text generation engine
├── gibson-vocabulary.js     # Cyberpunk vocabulary database
├── package.json             # Dependencies
├── test-local.js            # Local testing script
├── test-generator.js        # Generator testing script
├── deploy.sh                # Packaging script
├── .env.example             # Environment template
└── README.md                # This file
```

## 🏃‍♂️ Quick Start

### 1. Setup Environment

```bash
# Copy environment template
cp .env.example .env

# Edit with your Airtable Personal Access Token
# Get it from: https://airtable.com/create/tokens
nano .env
```

### 2. Test Locally

```bash
# Install dependencies
npm install

# Test the generator standalone
npm run test-generator

# Test the full Lambda function
npm test
```

### 3. Package for Lambda

```bash
# Create deployment package
npm run package
```

This creates `gibsongen-lambda.zip` ready for AWS Lambda.

## 🎨 Customizing the Vocabulary

Want to change the style or add new words? Edit `gibson-vocabulary.js`:

```javascript
// Add new cyberpunk terms
nouns: [
  'matrix', 'data', 'cyber', 'chrome', 'neon',
  'blockchain', 'quantum', 'hologram', 'biometric',
  // Add your own words here!
],

// Create new sentence templates
templates: [
  "The {adjective} {noun} {verb} through the {location}.",
  // Add your own patterns here!
]
```

**Test your changes:**
```bash
npm run test-generator  # See your new vocabulary in action
```

## ☁️ AWS Lambda Deployment

### Step 1: Create Lambda Function

1. **Go to AWS Lambda Console**
   - Search "Lambda" in AWS Console
   - Click "Create function"

2. **Configure Function**
   - Choose: **"Author from scratch"**
   - Function name: `gibsongen-lambda`
   - Runtime: **Node.js 18.x**
   - Architecture: **x86_64**
   - Click **"Create function"**

### Step 2: Upload Code

1. **Upload Package**
   - In the "Code" tab
   - Click **"Upload from"** → **".zip file"**
   - Upload your `gibsongen-lambda.zip`
   - Wait for upload to complete

2. **Configure Settings**
   - Go to **"Configuration"** tab
   - **"General configuration"** → **"Edit"**
   - Memory: **512 MB**
   - Timeout: **2 minutes**
   - Click **"Save"**

### Step 3: Environment Variables

1. **Configuration** → **Environment variables** → **Edit**
2. **Add environment variable:**
   - Key: `AIRTABLE_PERSONAL_ACCESS_TOKEN`
   - Value: `your_airtable_personal_access_token_here`
   - Key: `AIRTABLE_BASE_ID`
   - Value: `your_airtable_base_id_here`
3. Click **"Save"**

### Step 4: Test Function

1. **Test** tab → **Create new test event**
2. Event name: `daily-trigger`
3. Use default JSON: `{}`
4. Click **"Test"**
5. Check logs for success ✅

## ⏰ Schedule Daily Runs

### Create EventBridge Rule

1. **Go to Amazon EventBridge**
   - Search "EventBridge" in AWS Console
   - **Rules** → **Create rule**

2. **Configure Rule**
   - Name: `gibsongen-lambda-daily`
   - Event bus: `default`
   - Rule type: **Schedule**
   - Click **"Next"**

3. **Set Schedule**
   - Schedule pattern: **Rate or Cron expression**
   - Cron expression: `0 14 * * ? *`  (9 AM EST daily)
   - Click **"Next"**

4. **Add Target**
   - Target type: **AWS service**
   - Service: **Lambda function**
   - Function: `gibsongen-lambda`
   - Click **"Next"** → **"Next"** → **"Create rule"**

EventBridge will automatically add permissions to invoke your Lambda.

## 📊 Monitoring

### CloudWatch Logs
- **Lambda Console** → Your function → **Monitor** → **View CloudWatch logs**
- Look for successful runs and any errors

### Airtable Verification
- Check "Daily Batches" table for new records
- Check "Gibsongen Prompts" table for new generated text

## 💰 Cost Breakdown (FREE)

- **Lambda:** 1M free requests/month (you'll use ~30)
- **EventBridge:** 14M free events/month (you'll use ~30) 
- **CloudWatch Logs:** 5GB free storage
- **Total cost:** $0/month ✅

## 🔧 Troubleshooting

### Memory Issues
- Increase memory to 256MB in Lambda configuration (much less needed than before!)

### Timeout Issues  
- Text generation is very fast - 30 seconds should be plenty
- Check region selection for better performance

### Airtable Errors
- Verify Personal Access Token has correct permissions:
  - ✅ data.records:read
  - ✅ data.records:write  
  - ✅ schema.bases:read
- Ensure token includes your Airtable base
- Check base ID in code matches your base

### Text Generation Issues
- If paragraphs seem repetitive, expand vocabulary in `gibson-vocabulary.js`
- Test locally with `npm run test-generator` to see output quality

## 📝 Expected Airtable Structure

Your Airtable base should have these tables:

### Daily Batches
- Date (Date field)
- Status (Single select: Pending, Text Generated, Uploaded, Published)
- Notes (Long text)

### Gibsongen Prompts
- Generated Text (Long text)
- Prompt Number (Number: 1-4)
- Status (Single select: Pending, Uploaded, Complete, Error)
- Batch (Link to Daily Batches)

## 🎨 Next Steps

Once your generator is running daily:

1. **Verify** - Check Airtable gets populated each morning with new generated text
2. **Customize** - Expand vocabulary in `gibson-vocabulary.js` for more variety

## 🆘 Support

If you encounter issues:

1. Check CloudWatch logs for error details
2. Verify Airtable API permissions
3. Test locally first with `npm test`
4. Ensure all environment variables are set

Your Gibsongen Lambda will now run automatically every day at 9 AM, creating rich, varied cyberpunk text for your Airtable base! 🤖