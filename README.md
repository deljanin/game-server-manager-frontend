# Nuxt Game Server Manager UI

This project is a Nuxt 3 frontend that connects to a Django backend. You’ll need to configure environment variables before running the app.

---

## Setup

Clone the repository:

```bash
git clone https://github.com/deljanin/game-server-manager-frontend.git
cd game-server-manager-frontend
```

## Environment Setup

Create a `.env` file in the root of the project with the following contents. <br> (Or your publicly available domain pointing to the backend python server):

```env
API_BASE_URL=http://localhost:8000
WS_BASE_URL=ws://localhost:8000
```

## Instructions

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

## Run webserver

To run the server use this command:

```bash
node .output/server/index.mjs
```

Or use pm2 to manage as a service.

Once live go to (on local machine):

```
http://localhost:3000/register
```

or on your domain pointing to your machine:

```
https://yourdomain.com/register
```
