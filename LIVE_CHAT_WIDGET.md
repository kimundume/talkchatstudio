# 💬 Live Chat Widget - TalkChat Studio

## Overview

Embeddable live chat widget that customers can add to their websites to enable real-time conversations with visitors.

---

## ✅ What's Implemented

### 1. **Widget API Endpoints**

**Initialize Widget** (`/api/widget/init`)
- Fetches chatbot configuration by embed code
- Validates chatbot is active
- Returns chatbot settings (colors, position, messages)

**Create Conversation** (`/api/widget/conversation`)
- Creates new conversation for visitor
- Tracks visitor by unique ID (stored in localStorage)
- Sends automatic greeting message
- Reuses existing open conversations

**Send Message** (`/api/widget/message`)
- POST: Send visitor message
- GET: Fetch conversation messages
- Updates conversation timestamp
- Real-time message delivery

### 2. **Chat Widget Component**

**Features:**
- ✅ Floating chat button (customizable position)
- ✅ Expandable chat window
- ✅ Minimize functionality
- ✅ Custom colors (primary & secondary)
- ✅ Custom greeting message
- ✅ Custom placeholder text
- ✅ Visitor ID tracking
- ✅ Message history
- ✅ Auto-scroll to latest message
- ✅ Enter to send, Shift+Enter for new line
- ✅ Responsive design
- ✅ Smooth animations

**UI Elements:**
- Chat button (bottom-right or bottom-left)
- Chat header with chatbot name
- Message list with sender distinction
- Input field with send button
- Minimize and close buttons
- "Powered by TalkChat Studio" branding

### 3. **Widget Demo Page** (`/widget-demo`)

Test your widget before embedding:
- Enter embed code
- Live preview in iframe
- Embed code instructions
- Step-by-step integration guide

### 4. **Visitor Tracking**

- Unique visitor ID generated on first visit
- Stored in localStorage
- Persists across sessions
- Used to maintain conversation continuity

---

## 📁 File Structure

```
src/
├── app/
│   ├── api/
│   │   └── widget/
│   │       ├── init/
│   │       │   └── route.ts         # Initialize widget
│   │       ├── conversation/
│   │       │   └── route.ts         # Create conversation
│   │       └── message/
│   │           └── route.ts         # Send/receive messages
│   ├── widget/
│   │   └── page.tsx                 # Widget page
│   └── widget-demo/
│       └── page.tsx                 # Demo/test page
└── components/
    └── widget/
        └── ChatWidget.tsx           # Main widget component
```

---

## 🚀 How to Use

### For Platform Users (Your Customers)

**Step 1: Create a Chatbot**
1. Go to `/chatbots`
2. Click "Create Chatbot"
3. Customize appearance and messages
4. Copy the embed code

**Step 2: Test the Widget**
1. Go to `/widget-demo`
2. Paste your embed code
3. Click "Test Widget"
4. Interact with the widget to test

**Step 3: Embed on Website**

Add this code before the closing `</body>` tag:

```html
<script>
  (function() {
    var iframe = document.createElement('iframe');
    iframe.src = 'https://yourdomain.com/widget?embed=YOUR_EMBED_CODE';
    iframe.style.position = 'fixed';
    iframe.style.bottom = '0';
    iframe.style.right = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.zIndex = '9999';
    iframe.style.pointerEvents = 'none';
    document.body.appendChild(iframe);
  })();
</script>
```

Replace `YOUR_EMBED_CODE` with your actual code (e.g., `tchat-abc123xyz`)

---

## 🎨 Customization

### Colors

Set in chatbot settings:
- **Primary Color**: Chat button, agent messages, header
- **Secondary Color**: Bot avatar background
- Default: Orange (#FF8C42) and Purple (#3D2E5C)

### Position

Choose widget position:
- `bottom-right` (default)
- `bottom-left`

### Messages

Customize:
- **Greeting**: First message visitors see
- **Placeholder**: Input field placeholder text

---

## 🔄 How It Works

### 1. Visitor Opens Widget

```
1. Visitor clicks chat button
2. Widget calls /api/widget/init with embed code
3. Chatbot settings loaded
4. Widget displays with custom colors/messages
```

### 2. Conversation Creation

```
1. Widget calls /api/widget/conversation
2. Checks for existing open conversation
3. Creates new conversation if needed
4. Sends automatic greeting message
5. Returns conversation ID and messages
```

### 3. Message Flow

```
Visitor sends message:
1. Message displayed immediately (optimistic update)
2. POST to /api/widget/message
3. Message saved to database
4. Conversation timestamp updated
5. Message appears in agent's inbox

Agent responds:
1. Agent sends message in /conversations/[id]
2. Message saved to database
3. Visitor can poll for new messages (future: WebSocket)
```

---

## 💡 Features in Detail

### Visitor ID Tracking

```javascript
// Generated on first visit
const visitorId = `visitor_${Date.now()}_${randomString}`;

// Stored in localStorage
localStorage.setItem('tchat_visitor_id', visitorId);

// Used to link conversations
```

### Conversation Continuity

- Visitor returns → Same visitor ID
- Existing open conversation → Reused
- All messages preserved
- No duplicate conversations

### Message Types

- **VISITOR**: Messages from website visitors
- **AGENT**: Messages from support team
- **BOT**: Automated messages (greeting, triggers)

---

## 🎯 API Reference

### GET /api/widget/init

**Query Parameters:**
- `embedCode` (required): Chatbot embed code

**Response:**
```json
{
  "success": true,
  "chatbot": {
    "id": "chatbot_id",
    "name": "Support Bot",
    "settings": {
      "primaryColor": "#FF8C42",
      "secondaryColor": "#3D2E5C",
      "position": "bottom-right",
      "greeting": "Hi! How can we help?",
      "placeholder": "Type your message..."
    }
  }
}
```

### POST /api/widget/conversation

**Body:**
```json
{
  "chatbotId": "chatbot_id",
  "visitorId": "visitor_123",
  "visitorName": "John Doe",
  "visitorEmail": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "conversation": {
    "id": "conv_id",
    "messages": [
      {
        "id": "msg_id",
        "content": "Hi! How can we help?",
        "sender": "BOT",
        "createdAt": "2025-01-01T00:00:00Z"
      }
    ]
  }
}
```

### POST /api/widget/message

**Body:**
```json
{
  "conversationId": "conv_id",
  "content": "I need help with my order"
}
```

**Response:**
```json
{
  "success": true,
  "message": {
    "id": "msg_id",
    "content": "I need help with my order",
    "sender": "VISITOR",
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

---

## 🔧 Advanced Configuration

### Custom Domain

Update embed code URL:
```javascript
iframe.src = 'https://chat.yourdomain.com/widget?embed=YOUR_CODE';
```

### Widget Styling

Modify `ChatWidget.tsx` to customize:
- Window size (default: 380x600px)
- Border radius
- Shadow effects
- Font family
- Animation speed

### Branding

Remove "Powered by TalkChat Studio":
```typescript
// In ChatWidget.tsx, remove or modify:
<p className="text-xs text-gray-400 mt-2 text-center">
  Powered by TalkChat Studio
</p>
```

---

## 🐛 Troubleshooting

### Widget not appearing

1. Check embed code is correct
2. Verify chatbot is active
3. Check browser console for errors
4. Ensure script is before `</body>` tag

### Messages not sending

1. Check network tab for API errors
2. Verify conversation ID exists
3. Check database connection
4. Review server logs

### Styling issues

1. Check for CSS conflicts
2. Verify z-index is high enough (9999)
3. Test in different browsers
4. Check iframe permissions

---

## 🚀 Future Enhancements

**Real-Time Updates:**
- WebSocket integration
- Live agent typing indicators
- Instant message delivery
- Online/offline status

**Advanced Features:**
- File uploads
- Image sharing
- Emoji picker
- Read receipts
- Conversation ratings
- Pre-chat forms
- Offline messages
- Chat transcripts

**Analytics:**
- Visitor tracking
- Conversation metrics
- Response times
- Popular questions

---

## 📊 Testing

### Manual Testing

1. **Create Test Chatbot**
   ```
   - Go to /chatbots/new
   - Create "Test Bot"
   - Copy embed code
   ```

2. **Test in Demo**
   ```
   - Go to /widget-demo
   - Paste embed code
   - Send test messages
   ```

3. **Verify in Inbox**
   ```
   - Go to /conversations
   - Find test conversation
   - Reply as agent
   ```

### Integration Testing

```html
<!-- Create test.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Widget Test</title>
</head>
<body>
  <h1>Test Page</h1>
  
  <script>
    (function() {
      var iframe = document.createElement('iframe');
      iframe.src = 'http://localhost:3000/widget?embed=YOUR_CODE';
      iframe.style.position = 'fixed';
      iframe.style.bottom = '0';
      iframe.style.right = '0';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      iframe.style.zIndex = '9999';
      iframe.style.pointerEvents = 'none';
      document.body.appendChild(iframe);
    })();
  </script>
</body>
</html>
```

---

## 🎉 Success!

Your live chat widget is ready to use! Customers can now:
- ✅ Embed chat on their websites
- ✅ Receive visitor messages
- ✅ Respond in real-time
- ✅ Track conversations
- ✅ Customize appearance

**The complete flow:**
1. Customer creates chatbot → Gets embed code
2. Customer adds code to website → Widget appears
3. Visitor clicks widget → Conversation starts
4. Messages flow → Agent responds in inbox
5. Conversation tracked → Analytics available

---

**Next Steps:**
- Add WebSocket for real-time updates
- Implement triggers for automation
- Build team management
- Add analytics dashboard
