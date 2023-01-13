<br>
<br>
<p align="center">
<a href="https://enrolla.io/#gh-light-mode-only">
<img width="300" src="https://raw.githubusercontent.com/enrolla/enrolla/main/logo-light.png#gh-light-mode-only">
</a>
<a href="https://enrolla.io/#gh-dark-mode-only">
<img width="300" src="https://raw.githubusercontent.com/enrolla/enrolla/main/logo-dark.png#gh-dark-mode-only">
</a>
</p>
<br>
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

 <p align="center">
    <br />
    <a href="https://docs.enrolla.io" rel="dofollow"><strong>Explore the docs »</strong></a>
 </p>

# ⭐️ Why Enrolla?

Managing customer configurations takes much work. At first, it seems like just creating another SQL database, but in reality, it's just the beginning.

You need to define different pricing tiers for different customers, but some important ones require extra customization. You need to store lots of different values for them - throttling configurations, secrets, and just plain JSONs. And you need to be able to access these configurations across your system - with 0 latency. You need this data synchronized across many systems - CRMs, authentication services, billing systems, and even sometimes your Databases.
Enrolla's goal is to simplify customer configuration management and provide developers with the tools to focus on delivering best-in-class products - while providing the needed flexibility for the rest of the company.

# ✨ Features

- 🛂 Easily manage all your configurations - throttling, secrets, just plain JSONs
- 🧩 Integrations with CRMs, authentication services, billing systems
- ⏩ Typescript SDK for fetching configurations to your services with smart caching (Python and Go in developement)
- 📦 Built-in backoffice for non engineers
- 😎 Headless UI templates for providing needed knobs for your customers (in developement)
- 👩‍💻 Community driven

# 🚀 Getting Started

### Local Developement

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
