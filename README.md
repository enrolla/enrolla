<p align="center">
<a href="https://enrolla.io/#gh-light-mode-only">
<img width="300" src="https://raw.githubusercontent.com/enrolla/enrolla/main/logo-light.png#gh-light-mode-only">
</a>
<a href="https://enrolla.io/#gh-dark-mode-only">
<img width="300" src="https://raw.githubusercontent.com/enrolla/enrolla/main/logo-dark.png#gh-dark-mode-only">
</a>
</p>

<p align="center">
  <img src="https://github.com/enrolla/enrolla/actions/workflows/ci.yml/badge.svg" alt="CI">
  <img src="https://github.com/enrolla/enrolla/actions/workflows/cd.yml/badge.svg" alt="CD">
  <img src="https://therealsujitk-vercel-badge.vercel.app/?app=enrolla-mgmt-ui" />
  <a href="CODE_OF_CONDUCT.md">
    <img src="https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg" alt="Contributor Covenant">
  </a>
  <a href="https://opensource.org/licenses/Apache-2.0">
    <img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="License">
  </a>
</p>

### Getting Started with Local Developement

Enrolla is using a monorepo (powered by [Nx Workspaces](https://nx.dev/)) with multiple apps and libraries.

It's backend is based on [NestJS](https://nestjs.com/), and its front-end is a [Vite](https://vitejs.dev/) deployment of a [Refine app](https://refine.dev/).

Follow these instructions to set up a local developement environment.

1. Clone the repositoriy and install dependencies:

   ```bash
   git clone https://github.com/enrolla/enrolla.git
   cd enrolla
   nvm install
   npm install
   ```

2. Set up a local Postgres Database. You can use [Postgres.app](https://postgresapp.com/) for Mac for example.

3. Set up [doppler](https://www.doppler.com/), our secrets manager:

   ```bash
   doppler login
   doppler setup
   ```

4. Apply database migrations:

   ```bash
   doppler run -- npx nx run prisma-models:prisma-deploy
   ```

5. To start developing, run the `serve` target on both the backend and the frontend:

   ```bash
   # This will serve the Backend in development mode
   doppler run -- npx nx serve
   # This will serve the Frontend in development mode
   doppler run -p frontend -c dev -- npx nx serve mgmt-ui
   ```

That's it, you are good to go! Happy hacking! 👾
