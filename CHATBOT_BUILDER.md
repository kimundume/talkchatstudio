# 🤖 Chatbot Builder - TalkChat Studio

## Overview

Complete chatbot management system with creation, customization, and embed code generation.

---

## ✅ What's Implemented

### 1. **Chatbots List Page** (`/chatbots`)
- View all chatbots in card layout
- Status badges (Active/Inactive)
- Conversation count per chatbot
- Quick actions dropdown:
  - View Details
  - Settings
  - Copy Embed Code
  - Activate/Deactivate
  - Delete
- Empty state with call-to-action
- "Create Chatbot" button

### 2. **Create Chatbot Page** (`/chatbots/new`)
**Basic Information:**
- Chatbot name (required)
- Description (optional)

**Appearance Customization:**
- Primary color picker (default: #FF8C42 - Orange)
- Secondary color picker (default: #3D2E5C - Purple)
- Widget position (bottom-right or bottom-left)

**Messages:**
- Greeting message
- Input placeholder text

**Live Preview:**
- Real-time widget preview
- Interactive chat button
- Simulated chat window
- Updates as you customize

### 3. **Chatbot Details Page** (`/chatbots/[id]`)
**Statistics Cards:**
- Total conversations
- Active triggers count
- Current status (Live/Paused)

**Embed Code Section:**
- Copy-to-clipboard functionality
- Installation instructions
- Unique embed code per chatbot

**Appearance Preview:**
- Color swatches
- Current settings display
- Position indicator

**Quick Actions:**
- Edit Settings
- View Conversations
- Manage Triggers

### 4. **Server Actions** (`src/app/actions/chatbot.ts`)
- `createChatbot()` - Create new chatbot with settings
- `updateChatbot()` - Update chatbot configuration
- `deleteChatbot()` - Delete chatbot (with confirmation)
- `toggleChatbotStatus()` - Activate/deactivate chatbot
- `getChatbots()` - Fetch all chatbots for tenant
- `getChatbot()` - Fetch single chatbot details

### 5. **Components**

**ChatbotList** (`src/components/chatbots/ChatbotList.tsx`)
- Card-based layout
- Dropdown menu with actions
- Real-time status updates
- Conversation count display

**ChatWidgetPreview** (`src/components/chatbots/ChatWidgetPreview.tsx`)
- Live preview component
- Customizable colors
- Position simulation
- Interactive chat button
- Greeting message display

**CopyEmbedCode** (`src/components/chatbots/CopyEmbedCode.tsx`)
- Code snippet display
- One-click copy
- Visual feedback (copied state)
- Installation instructions

---

## 📁 File Structure

```
src/
├── app/
│   ├── actions/
│   │   └── chatbot.ts              # Server actions for CRUD
│   └── chatbots/
│       ├── page.tsx                # List all chatbots
│       ├── new/
│       │   └── page.tsx            # Create new chatbot
│       └── [id]/
│           └── page.tsx            # Chatbot details
├── components/
│   ├── chatbots/
│   │   ├── ChatbotList.tsx         # Chatbot cards grid
│   │   ├── ChatWidgetPreview.tsx   # Live preview
│   │   └── CopyEmbedCode.tsx       # Embed code component
│   └── ui/
│       ├── badge.tsx               # Status badges
│       └── textarea.tsx            # Text input
```

---

## 🎨 Features

### Multi-Tenant Support
- ✅ Each chatbot belongs to a tenant
- ✅ Users only see their tenant's chatbots
- ✅ Tenant isolation enforced in all queries

### Unique Embed Codes
- ✅ Generated using nanoid (12 characters)
- ✅ Format: `tchat-xxxxxxxxxxxx`
- ✅ Used to identify chatbot on websites

### Customization Options
- ✅ Primary & secondary colors
- ✅ Widget position (bottom-right/left)
- ✅ Custom greeting message
- ✅ Custom input placeholder
- ✅ Show/hide branding (future)

### Real-Time Preview
- ✅ See changes instantly
- ✅ Interactive widget simulation
- ✅ Accurate color representation
- ✅ Position preview

---

## 🚀 Usage

### Creating a Chatbot

1. **Navigate to Chatbots**
   ```
   http://localhost:3000/chatbots
   ```

2. **Click "Create Chatbot"**

3. **Fill in the form:**
   - Name: "Customer Support Bot"
   - Description: "Help customers 24/7"
   - Primary Color: #FF8C42 (or choose your own)
   - Secondary Color: #3D2E5C (or choose your own)
   - Position: Bottom Right
   - Greeting: "Hi! How can we help you today?"
   - Placeholder: "Type your message..."

4. **Preview in real-time** on the right side

5. **Click "Create Chatbot"**

6. **Copy the embed code** from the details page

### Embedding on Your Website

```html
<!-- Add before closing </body> tag -->
<script src="https://cdn.talkchat.studio/widget.js" data-chatbot="tchat-xxxxxxxxxxxx"></script>
```

### Managing Chatbots

**From the list:**
- Click the ⋮ menu on any chatbot card
- Choose an action:
  - **View Details** - See full information
  - **Settings** - Edit configuration
  - **Copy Embed Code** - Get installation code
  - **Activate/Deactivate** - Toggle status
  - **Delete** - Remove chatbot

**From details page:**
- View statistics
- Copy embed code
- Access quick actions
- Navigate to related features

---

## 🎯 Database Schema

### Chatbot Model

```prisma
model Chatbot {
  id          String   @id @default(cuid())
  tenantId    String
  name        String
  description String?
  settings    Json     // Widget customization
  embedCode   String   @unique
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  tenant        Tenant         @relation(...)
  conversations Conversation[]
  triggers      Trigger[]
}
```

### Settings JSON Structure

```json
{
  "primaryColor": "#FF8C42",
  "secondaryColor": "#3D2E5C",
  "position": "bottom-right",
  "greeting": "Hi! How can we help you today?",
  "placeholder": "Type your message...",
  "showBranding": true
}
```

---

## 🔧 Customization

### Adding New Color Schemes

Update the default colors in the create form:

```typescript
const [primaryColor, setPrimaryColor] = useState("#YOUR_COLOR");
const [secondaryColor, setSecondaryColor] = useState("#YOUR_COLOR");
```

### Adding More Positions

Update the position select options:

```typescript
<option value="bottom-right">Bottom Right</option>
<option value="bottom-left">Bottom Left</option>
<option value="top-right">Top Right</option>
<option value="top-left">Top Left</option>
```

### Custom Widget Sizes

Add size options to settings:

```typescript
settings: {
  // ... existing settings
  size: "small" | "medium" | "large"
}
```

---

## 📊 Statistics & Analytics

Currently tracking:
- ✅ Total conversations per chatbot
- ✅ Active triggers count
- ✅ Active/inactive status

**Future enhancements:**
- Response time
- Customer satisfaction
- Peak usage hours
- Conversion rates

---

## 🔐 Security

- ✅ Tenant isolation (users only see their chatbots)
- ✅ Server-side validation
- ✅ Protected routes (requires authentication)
- ✅ Unique embed codes (prevents conflicts)

---

## 🐛 Troubleshooting

### Chatbot not appearing in list
- Check if you're logged in
- Verify you have a tenant assigned
- Check database connection

### Embed code not working
- Verify the script URL is correct
- Check if chatbot is active
- Ensure embed code matches database

### Preview not updating
- Check browser console for errors
- Verify color values are valid hex codes
- Try refreshing the page

---

## 🎯 Next Steps

Now that chatbot creation is complete, you can:

1. **Build the Live Chat Widget** - The actual embeddable widget
2. **Create Conversation Inbox** - Handle incoming chats
3. **Add Triggers System** - Automated responses
4. **Implement Analytics** - Track performance

---

## 📚 Related Documentation

- `DATABASE_SETUP.md` - Database configuration
- `AUTHENTICATION_SETUP.md` - Auth system
- `QUICKSTART.md` - Getting started guide

---

**Chatbot Builder is ready to use!** 🎉

Users can now create, customize, and manage chatbots with live preview and easy embedding.
