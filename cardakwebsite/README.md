# Çardak

Çardak is a full-stack web application that provides a platform for creating and taking tests, sharing photos, and participating in daily forum discussions.

## Features

- **Tests:** Create custom tests with multiple choice, image-based, or open-ended questions. Take tests and view results.
- **Photos:** Upload and view images shared by the community.
- **Daily Short Forum:** Participate in discussions by posting short comments with a temporary username.

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm 8.x or later
- Supabase account (for backend services)

### Setting Up Supabase

1. Create a new Supabase project at [https://supabase.com](https://supabase.com)
2. Run the SQL in `lib/supabase-schema.sql` in the Supabase SQL Editor to set up your database schema
3. Create two storage buckets:
   - `photos` - for storing user-uploaded photos
   - `test-images` - for storing test-related images
4. Set both buckets to have public read access (via RLS policies)
5. Copy your Supabase URL and anon key from the project settings

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cardakwebsite.git
   cd cardakwebsite
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `/app` - Next.js 13+ App Router components and pages
- `/components` - Reusable UI components
- `/lib` - Supabase client and service functions
  - `supabaseClient.ts` - Supabase instance configuration
  - `supabaseService.ts` - Service functions for data operations
  - `authService.ts` - Authentication functions
  - `types.ts` - TypeScript interfaces for the application
  - `supabase-schema.sql` - SQL schema for setting up Supabase

## Deployment

The project is configured to be deployed on Vercel. Connect your GitHub repository to Vercel for automatic deployments.

## License

This project is licensed under the MIT License.
