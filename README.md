# 💬 TalkChat Studio

A modern, multi-tenant customer support platform with AI-powered chatbots, live chat, and omnichannel messaging.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E)

## ✨ Features

- 🤖 **AI-Powered Chatbots** - Create intelligent chatbots with custom training
- 💬 **Live Chat** - Real-time conversations with customers
- 📊 **Analytics Dashboard** - Track performance and customer insights
- 🎨 **Customizable Widget** - Embed chat on any website
- 👥 **Team Management** - Multi-user support with role-based access
- 🔔 **Smart Triggers** - Automate workflows and responses
- 🌐 **Omnichannel** - Support for Website, WhatsApp, Facebook, Instagram, Email, SMS
- 🏢 **Multi-Tenant** - SaaS-ready architecture with tenant isolation
- 🎨 **Modern UI** - Beautiful, responsive design with dark mode

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (Supabase recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/kimundume/talkchatstudio.git
cd talkchatstudio
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp env.example.txt .env
```

Edit `.env` with your credentials:
```env
DATABASE_URL="your_supabase_connection_string"
NEXTAUTH_SECRET="generate_with_openssl_rand_base64_32"
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
```

4. **Run database migrations:**
```bash
npx prisma migrate dev
npx prisma generate
```

5. **Start development server:**
```bash
npm run dev
```

6. **Open your browser:**
```
http://localhost:3000
```

## 📚 Documentation

- [Quick Start Guide](QUICKSTART.md) - Get up and running in 5 minutes
- [Database Setup](DATABASE_SETUP.md) - Configure your database
- [Authentication](AUTHENTICATION_SETUP.md) - Set up user authentication
- [Deployment Guide](DEPLOYMENT.md) - Deploy to production
- [Widget Integration](LIVE_CHAT_WIDGET.md) - Embed chat on your website
- [Brand Guidelines](BRAND_GUIDE.md) - Customize branding

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Authentication:** NextAuth.js
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Icons:** Lucide React

## 🏗️ Project Structure

```
talkchat-studio/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── lib/             # Utility functions
│   └── constants/       # App constants
├── prisma/              # Database schema & migrations
├── public/              # Static assets
└── scripts/             # Utility scripts
```

## 🎯 Key Features

### 1. Multi-Tenant Architecture
- Complete tenant isolation
- Subscription-based plans (Starter, Pro, Agency)
- Per-tenant resource limits

### 2. Chatbot Builder
- Visual chatbot creation
- Custom training data
- AI-powered responses
- Multi-channel deployment

### 3. Live Chat Widget
- Embeddable on any website
- Customizable appearance
- Real-time messaging
- File uploads
- Typing indicators

### 4. Analytics & Reporting
- Conversation metrics
- Agent performance
- Customer insights
- Response time tracking

### 5. Team Collaboration
- Role-based access control
- Chat assignment
- Internal notes
- Team performance metrics

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub:**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy to Vercel:**
```bash
npm install -g vercel
vercel
```

3. **Add environment variables in Vercel dashboard**

4. **Deploy:**
```bash
vercel --prod
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 🧪 Testing

```bash
# Run tests
npm test

# Run linter
npm run lint

# Type check
npm run type-check
```

## 📦 Build

```bash
# Production build
npm run build

# Start production server
npm start
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Database hosted on [Supabase](https://supabase.com/)
- Icons by [Lucide](https://lucide.dev/)

## 📞 Support

- 📧 Email: support@talkchatstudio.com
- 📖 Documentation: [docs.talkchatstudio.com](https://docs.talkchatstudio.com)
- 💬 Discord: [Join our community](https://discord.gg/talkchat)

## 🗺️ Roadmap

- [ ] WhatsApp integration
- [ ] Facebook Messenger integration
- [ ] Instagram DM integration
- [ ] Email support
- [ ] SMS support
- [ ] Advanced AI training
- [ ] Custom integrations API
- [ ] Mobile apps (iOS/Android)
- [ ] Voice chat support
- [ ] Video chat support

---

**Made with ❤️ by the TalkChat Studio team**
