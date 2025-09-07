# NicheConnect 🚀

**Your curated launchpad for student entrepreneur success**

A comprehensive community hub for student entrepreneurs to discover funding opportunities, enhance skills through masterclasses, connect with co-founders, and get structured feedback from peers.

## Features

### 🎯 Curated Funding & Grant Hub
- Regularly updated, filterable list of grants, pitch competitions, and early-stage investor networks
- Tailored specifically for student ventures with deadlines and eligibility criteria
- Featured opportunities and deadline tracking

### 📚 On-Demand Skill Masterclasses
- Library of actionable video and written modules covering essential startup skills
- Topics include Lean Canvas, sales, fundraising pitches, and legal essentials
- Tiered access based on subscription level

### 🤝 AI-Powered Founder Matching
- Intelligent matching system connecting student entrepreneurs
- Based on industry, skills, project stage, and co-founder needs
- Facilitates collaboration and team building

### 💬 Community Feedback Circles
- Structured peer feedback sessions for business ideas
- Safe, curated community environment
- Constructive criticism and support system

## Subscription Tiers

- **Free**: Limited access to opportunities and basic content
- **Pro ($10/month)**: Full access to curated listings and webinars
- **Founder's Circle ($25/month)**: Pro + exclusive networking events and direct feedback sessions

## Tech Stack

- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Blockchain**: Base (via OnchainKit and MiniKit)
- **Backend**: Supabase for data management
- **AI**: OpenAI/OpenRouter for founder matching
- **Wallet**: OnchainKit wallet components

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nicheconnect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   - `NEXT_PUBLIC_ONCHAINKIT_API_KEY`: Your OnchainKit API key
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `OPENAI_API_KEY` or `OPENROUTER_API_KEY`: For AI-powered matching

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Setup

The app uses Supabase for data management. You'll need to create the following tables:

- `users` - User profiles and subscription information
- `opportunities` - Funding opportunities and grants
- `masterclasses` - Educational content
- `connections` - User connections and matching
- `feedback_sessions` - Community feedback circles

## Deployment

This app is designed to be deployed as a Base Mini App. Make sure to:

1. Configure your environment variables in your deployment platform
2. Set up your Supabase database with proper Row Level Security (RLS)
3. Configure your OnchainKit API key for Base integration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
