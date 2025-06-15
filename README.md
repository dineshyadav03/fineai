# FineAI - Model Fine-tuning Platform

A full-stack web application for fine-tuning Cohere models using custom datasets.

## Features

- User authentication with Supabase
- File upload support for JSON and CSV files
- Model fine-tuning with Cohere API
- Real-time job status tracking
- Model download and testing capabilities

## Tech Stack

- Frontend: Next.js 14, Tailwind CSS, TypeScript
- Backend: Next.js API Routes
- Database: Supabase
- Storage: Supabase Storage
- AI: Cohere API
- Deployment: Vercel (Frontend), Railway (Backend)

## Prerequisites

- Node.js 18+ and npm
- Supabase account
- Cohere API key

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/fineai.git
   cd fineai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   COHERE_API_KEY=your-cohere-api-key
   ```

4. Set up Supabase:
   - Create a new Supabase project
   - Run the SQL migrations in `supabase/migrations/20240101000000_initial_schema.sql`
   - Enable email authentication in Supabase Auth settings

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   ├── ui/               # UI components
│   └── upload/           # File upload components
├── lib/                  # Utility functions
│   ├── supabase/        # Supabase client
│   ├── cohere/          # Cohere API client
│   └── utils/           # Helper functions
└── types/               # TypeScript types
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Deployment

1. Frontend (Vercel):
   - Connect your GitHub repository
   - Configure environment variables
   - Deploy

2. Backend (Railway):
   - Create new project
   - Connect repository
   - Configure environment variables
   - Deploy

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 