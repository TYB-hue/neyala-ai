# NEYALA.AI - Smart Travel Planning

NEYALA.AI is an AI-powered travel planning platform that creates personalized itineraries based on your specific needs and preferences. Named after one of Sudan's largest cities, NEYALA.AI aims to make travel planning accessible and enjoyable for everyone.

## Features

- AI-generated travel itineraries
- Personalized recommendations based on:
  - Travel group type (solo, couple, family, friends)
  - Special requirements (halal food, accessibility, pregnancy-friendly)
  - Budget preferences
  - Travel style
- Day-by-day planning
- Points of interest recommendations
- Accommodation suggestions
- Transportation options

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js with Express
- **Database**: Supabase
- **Authentication**: Clerk
- **AI Integration**: OpenAI GPT-4

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/neyala-ai.git
   cd neyala-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with the following variables:
   ```
   # Authentication (Clerk)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Database (Supabase)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # OpenAI
   OPENAI_API_KEY=your_openai_api_key

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── plan/           # Trip planning page
│   └── layout.tsx      # Root layout
├── components/         # Reusable components
├── lib/               # Utility functions and configurations
└── types/             # TypeScript type definitions
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 