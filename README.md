# Tabacznik

Tabacznik is a **fake** e-commerce platform for selling tobacco products.

## Tech stack

- [Bun](https://bun.sh) as package manager and task runner
- [TypeScript](https://www.typescriptlang.org) for type safety
- [Next.js 14](https://nextjs.org) + [next-safe-action](https://next-safe-action.dev) for typesafe full-stack experience
- [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) for styling
- [Drizzle ORM](https://orm.drizzle.team) + [SQLite](https://sqlite.org) for database

## How to run

- Clone this repo
- Run `bun install` to install dependencies
- `cp .env.example .env.local` and fill in the environment variables
- Create database using `bun db:push`
- Run `bun dev` to start the development server

Open [http://localhost:3000](http://localhost:3000) with your browser to see the page.
