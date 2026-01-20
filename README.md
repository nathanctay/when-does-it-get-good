# When Does It Get Good? (WDIGG)

A lightweight, crowdsourced utility site for television audiences to find the exact moment a series becomes essential viewing.

## 🚀 Features

- **Consensus Metrics:** See exactly which episode a show "gets good" at.
- **Vote Distribution:** Visual charts showing the community spread.
- **Sentiment Tags:** Track if the show is actually "Worth the wait".
- **Frictionless Voting:** No accounts required; cast your vote in seconds.
- **Web 2.0 Aesthetic:** A clean, functional, data-first interface.
- **Global Search:** Find any TV show via the TMDB-powered autocomplete.

## 🛠️ Tech Stack

- **Framework:** [Astro 5](https://astro.build/) (SSR Mode)
- **Runtime:** [Bun](https://bun.sh/)
- **UI:** [React 19](https://react.dev/) & [Tailwind CSS](https://tailwindcss.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Charts:** [Recharts](https://recharts.org/)
- **API:** [TMDB API](https://www.themoviedb.org/documentation/api)

## 📦 Installation

1. **Clone and Install:**
   ```bash
   bun install
   ```

2. **Environment Variables:**
   Create a `.env` file based on `.env.example`:
   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
   TMDB_API_KEY="your_api_key_here"
   PORT=4321
   ```

3. **Database Setup:**
   ```bash
   bun x prisma generate
   # Ensure your database matches the schema
   bun x prisma db push
   ```

4. **Development:**
   ```bash
   bun dev
   ```

## 🚢 Deployment (Oracle Cloud / Ubuntu)

1. **Build for production:**
   ```bash
   bun run build
   ```

2. **Start with PM2:**
   ```bash
   # Using the standalone Node entry point with Bun
   pm2 start "bun ./dist/server/entry.mjs" --name "get-good"
   ```

3. **Nginx Configuration:**
   Set up a reverse proxy to `http://localhost:4321`.

## 📄 License

Data provided by [TMDB](https://www.themoviedb.org/). This project is for personal and community use.
