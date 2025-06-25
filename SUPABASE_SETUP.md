# 🔐 Supabase Authentication Setup

Your FineAI app is ready for production authentication! Follow these steps to set up Supabase:

## Step 1: Create Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization
4. Enter project name: `fineai` (or any name you prefer)
5. Generate a strong database password
6. Choose a region close to you
7. Wait for the project to initialize (~2 minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://abcdefghijk.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

## Step 3: Configure Environment Variables

1. In your FineAI project folder, copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and replace the placeholder values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-url.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
   NEXT_PUBLIC_COHERE_API_KEY=cuv46hVOkzVRenju6e6yjx0eQ4Fb4C51WPFNkrHW
   ```

## Step 4: Set Up Google OAuth (Optional)

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Google** and click the toggle to enable it
3. You'll need to create a Google OAuth app:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
4. Copy the Client ID and Client Secret to Supabase

## Step 5: Restart Your App

1. Stop your development server (Ctrl+C)
2. Start it again: `npm run dev`
3. The setup warning should disappear
4. Try signing up with your email!

## 🎉 You're Done!

- Users can now create real accounts
- Email verification is automatically handled
- Google OAuth will work if configured
- All authentication is secure and production-ready

## Troubleshooting

- **Still seeing setup warning?** Make sure `.env.local` exists and has the correct values
- **Google sign-in not working?** Double-check the OAuth setup in both Google Cloud and Supabase
- **Email not working?** Check Supabase logs in the dashboard

Need help? Check the [Supabase docs](https://supabase.com/docs/guides/auth) or the FineAI repository. 