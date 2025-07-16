#!/bin/bash
echo "📦 Packaging Gibsongen Lambda for AWS..."

# Clean up
rm -f gibsongen-lambda.zip
rm -rf node_modules

# Install production dependencies
npm install --production

# Create deployment package
zip -r gibsongen-lambda.zip . -x "*.git*" "deploy.sh" "README.md" ".env" "test-local.js" "*.zip"

echo "✅ Package created: gibsongen-lambda.zip"
echo "📁 Size: $(ls -lh gibsongen-lambda.zip | awk '{print $5}')"
echo ""
echo "🚀 Ready for AWS Lambda deployment!"
echo "💡 Upload gibsongen-lambda.zip to your Lambda function"