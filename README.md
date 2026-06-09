# Self-hosted Microblogging Frontend Client

The app allows you to browse your news feed, add new posts, edit and delete them. The posts are stored locally in the browser, without using the backend. TLDR: React-based CRUD application

## Tech Stack

- React
- TypeScript
- [React Router](https://reactrouter.com/)
- daisyUI & TailwindCSS
- Dexie.js (indexedDB wrapper)
- Storybook

## Getting Started

### Pre-installation

In addition to [Node.js](https://nodejs.org/en/download/package-manager/all#fnm), you should have [pnpm](https://pnpm.io) installed on your machine.

### Installation

Install the dependencies:

```sh
pnpm install
```

### Development

Start the development server with HMR:

```sh
pnpm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```sh
pnpm run build
```

## Deployment

### Docker Deployment

This template includes a Dockerfile optimized for the pnpm package manager: `Dockerfile.pnpm`

To build and run using Docker:

```sh
# For pnpm
docker build -f apps/client/Dockerfile.pnpm -t app-client .

# Run the container
docker run -p 3000:3000 app-client
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

## Workspace commands

This repository is a small pnpm workspace with two packages:

- **client** – the application code under `apps/client`
- **docs** – Storybook and supporting docs under `apps/docs`

You can run each package from the repository root using the helper scripts:

```sh
pnpm run dev             # client dev server
pnpm run build           # client production build
pnpm run docs:dev        # docs dev server
pnpm run docs:storybook  # docs Storybook
```

If you prefer direct filters, the following commands mirror the scripts above:

```sh
pnpm --filter client dev
pnpm --filter docs storybook
```
