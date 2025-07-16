# 🔑 How to Create Airtable Personal Access Token

Airtable has replaced API keys with Personal Access Tokens. Here's how to create one for your Gibsongen Lambda text generator:

## Step 1: Create Personal Access Token

1. **Go to Airtable Token Creation**
   - Visit: https://airtable.com/create/tokens
   - Log in to your Airtable account

2. **Create New Token**
   - Click **"Create new token"**
   - Give it a name: `Gibsongen Lambda`
   - Add description: `Token for automated text generation and Airtable upload`

## Step 2: Set Token Scopes

**Required scopes for the generator to work:**

✅ **data.records:read** - Read records from your base  
✅ **data.records:write** - Create/update records in your base  
✅ **schema.bases:read** - Read base structure  

## Step 3: Add Your Base

1. **Add Access to Bases**
   - Click **"Add a base"**
   - Select **"Gibson Art Generator"** (the base we created)
   - This gives the token access to this specific base only

## Step 4: Create Token

1. **Review Permissions**
   - Verify scopes are correct
   - Verify base access is set
   
2. **Create Token**
   - Click **"Create token"**
   - **IMPORTANT:** Copy the token immediately!
   - Store it safely - you won't see it again

## Step 5: Add to Your Project

1. **Update .env file:**
   ```bash
   AIRTABLE_PERSONAL_ACCESS_TOKEN=patXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXX
   ```

2. **Test locally:**
   ```bash
   npm test
   ```

## 🔒 Token Security Tips

- **Never commit tokens to git** - .env is in .gitignore
- **Use environment variables** in production
- **Regenerate tokens** if compromised
- **Use minimal scopes** - only what you need

## 🆘 Token Issues?

### Token Not Working?
- Check scopes include all 3 required permissions
- Verify "Gibson Art Generator" base is added
- Ensure token isn't expired

### Access Denied?
- Double-check base name matches exactly
- Verify you're the base owner or have edit permissions
- Try creating a new token

### Still Having Issues?
- Test with a simple API call first:
  ```bash
  curl "https://api.airtable.com/v0/appPpARHvIT5O9HT9/Daily%20Batches" \
    -H "Authorization: Bearer YOUR_TOKEN_HERE"
  ```

Your token should now work with the Gibsongen Lambda text generator! 🎉