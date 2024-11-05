# Auth Starter Kit 🚀

A modern authentication starter kit built with Next.js 14, featuring multiple authentication methods and email verification.

---

## ✨ Features

- 🔐 **Multiple authentication methods**:
  - Email/Password with verification
  - OAuth (Google, GitHub)
- 📧 **Email verification system**
- 🔑 **Password reset functionality**
- 🎨 **Beautiful UI** built with Tailwind CSS and Shadcn/ui
- 🛡️ **Protected routes**
- 🔒 **Secure session management** with Lucia Auth
- 📱 **Responsive design**

## 🛠️ Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Prisma** (Database ORM)
- **Lucia Auth** (Authentication)
- **Resend** (Email service)
- **Tailwind CSS**
- **Shadcn/ui**
- **Zod** (Schema validation)

## 📋 Prerequisites

Before you begin, ensure you have:

- ✅ Node.js 18+
- ✅ PostgreSQL database
- ✅ Resend API key
- ✅ OAuth credentials (Google, GitHub)

## 🚀 Installation

### 1. Clone the repository:

```bash
git clone https://github.com/yourusername/auth-starter-kit.git
cd auth-starter-kit
```

### 2. Install dependencies:

```bash
npm install
```

### 3. Set up environment variables:

```bash
cp .env.example .env
```

### 4. Configure your `.env` file:

```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
LUCIA_AUTH_URL="http://localhost:3000"

# Email (Resend)
RESEND_API_KEY=""
RESEND_FROM_EMAIL=""

# OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```

### 5. Initialize the database:

```bash
npx prisma generate
npx prisma db push
```

## 🏃‍♂️ Development

Start the development server:

```bash
npm run dev
```

▶️ Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔄 Authentication Flow

### 📧 Email/Password

1. User signs up with email/password
2. Verification code is sent to email
3. User verifies email to activate account

### 🔑 OAuth (Google/GitHub)

1. User clicks OAuth provider button
2. Authenticates with provider
3. Account is created/linked automatically

### 🔐 Password Reset

1. User requests password reset
2. Reset link sent to email
3. User sets new password

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. 🍴 Fork the repository
2. 🌿 Create your feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit your changes (`git commit -m 'Add some amazing feature'`)
4. 📤 Push to the branch (`git push origin feature/amazing-feature`)
5. 🎯 Open a Pull Request

## 💬 Support

Need help? Please [open an issue](https://github.com/thmslfb/auth-starter-kit/issues) in the repository.

## 👏 Acknowledgments

Special thanks to these amazing projects:

- [Next.js](https://nextjs.org/)
- [Lucia Auth](https://lucia-auth.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Prisma](https://www.prisma.io/)
