# TaskFlow Frontend

A modern task management application built with Next.js 16+, TypeScript, and Tailwind CSS.

## Features

- User authentication (registration, login, password reset)
- Task management (create, read, update, delete)
- Real-time calendar view with countdown timers
- Responsive design with dark mode
- Animated UI components
- Protected routes and role-based access

## Tech Stack

- [Next.js 16+](https://nextjs.org/) with App Router
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Lucide React](https://lucide.dev/) for icons
- [Better Auth](https://better-auth.com/) for authentication

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
frontend/
├── app/                 # Next.js app directory
│   ├── api/             # API route handlers
│   ├── auth/            # Authentication pages
│   ├── calendar/        # Calendar view
│   ├── dashboard/       # User dashboard
│   ├── profile/         # User profile
│   ├── tasks/           # Task management
│   └── layout.tsx       # Root layout
├── components/          # React components
│   ├── ui/              # UI components
│   └── *.tsx            # Page components
├── lib/                 # Utility functions
└── public/              # Static assets
```

## Development

### Environment Variables

Create a `.env.local` file based on `.env.local.example`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-secret-key
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## Deployment

This application can be deployed to any platform that supports Next.js, such as Vercel, Netlify, or a custom server.