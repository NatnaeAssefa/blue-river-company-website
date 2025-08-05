# Telegram Contact Form Setup Guide

This guide will help you set up the contact form to send inquiries directly to your Telegram chat.

## 🤖 Step 1: Create a Telegram Bot

1. **Open Telegram** and search for `@BotFather`
2. **Start a chat** with BotFather
3. **Send the command**: `/newbot`
4. **Choose a name** for your bot (e.g., "Blue River Contact Bot")
5. **Choose a username** for your bot (must end with 'bot', e.g., "blueriver_contact_bot")
6. **Copy the Bot Token** that BotFather provides (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

## 📱 Step 2: Get Your Chat ID

### Option A: Using Your Personal Chat
1. **Start a chat** with your new bot
2. **Send any message** to the bot
3. **Open this URL** in your browser (replace `YOUR_BOT_TOKEN` with your actual token):
   ```
   https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
   ```
4. **Find your Chat ID** in the response (look for `"chat":{"id":123456789}`)

### Option B: Using a Group Chat
1. **Add your bot** to a Telegram group
2. **Send a message** in the group mentioning the bot
3. **Use the same URL** as above to get updates
4. **Find the group Chat ID** (will be negative, like `-123456789`)

## ⚙️ Step 3: Configure the Website

1. **Open** `js/script.js` file
2. **Find the TELEGRAM_CONFIG section** (around line 46)
3. **Replace the placeholder values**:

```javascript
const TELEGRAM_CONFIG = {
    botToken: '123456789:ABCdefGHIjklMNOpqrsTUVwxyz', // Your actual bot token
    chatId: '123456789'  // Your actual chat ID (or group ID)
};
```

## 🔒 Step 4: Security Considerations

### For Production Use:
- **Never expose your bot token** in client-side code for production
- **Consider using a backend service** to handle form submissions
- **Use environment variables** to store sensitive data

### Alternative Secure Setup:
1. **Create a simple backend API** (Node.js, PHP, Python, etc.)
2. **Store bot credentials** on the server
3. **Send form data** to your backend API
4. **Backend sends** to Telegram

## 📋 Step 5: Test the Setup

1. **Open your website**
2. **Fill out the contact form**
3. **Click "Send Message"**
4. **Check your Telegram** for the inquiry message

## 🎨 Message Format

The Telegram message will include:
- 👤 Customer name
- 📧 Email address
- 📱 Phone number
- 🔧 Selected service
- 💬 Message content
- ⏰ Timestamp

## 🔧 Troubleshooting

### Common Issues:

1. **"Telegram configuration not set" error**
   - Make sure you replaced the placeholder values in `TELEGRAM_CONFIG`

2. **"Telegram API error" message**
   - Check if your bot token is correct
   - Verify your chat ID is correct
   - Make sure the bot has permission to send messages

3. **Bot not responding**
   - Ensure you've started a chat with the bot
   - For groups, make sure the bot is added and has send message permissions

### Testing Your Configuration:

You can test your bot token and chat ID by opening this URL:
```
https://api.telegram.org/botYOUR_BOT_TOKEN/sendMessage?chat_id=YOUR_CHAT_ID&text=Test%20message
```

## 🚀 Advanced Features (Optional)

### Add More Formatting:
- Use Telegram's **Markdown** or **HTML** formatting
- Add **emojis** and **formatting** to make messages more readable

### Add File Attachments:
- Modify the code to handle **file uploads**
- Send **documents** or **images** via Telegram

### Add Auto-Responses:
- Set up **automatic replies** to customers
- Create **welcome messages** for new inquiries

## 📞 Support

If you need help setting this up:
- Email: blueriverbusinessgroup@gmail.com
- Phone: +251 97 055 5566

---

**Note**: This setup exposes your bot token in the client-side code. For production websites with high traffic, consider implementing a backend service for better security.
