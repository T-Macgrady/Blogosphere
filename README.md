# Blog

## Introduction

an system that integrates article publishing, page creation, and knowledge booklet functions for individuals.

## Tech stack

- Backend
  - NestJS
  - Mysql
  - typeorm
- Frontend
  - Next.js / React
  - ant-design
  - PWA
- Other
  - ESLint / Prettier / husky
  - pm2
  - swagger

## Features

- Article management
- Page management
- Knowledge booklet
- Comment management
- Email management
- Access statistics
- File management
- System settings

For more features, please visit the system for experience.

## Init

### Database

First, install MySQL. It is recommended to use docker to install.

```bash
docker image pull mysql:5.7
docker run -d --restart=always --name wipi -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root mysql:5.7
```

Then create a database.

```bash
docker container exec -it wipi bash;
mysql -u root -p;
CREATE DATABASE  `wipi` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Local Execution

```bash
git clone --depth=1 https://github.com/fantasticit/wipi.git your-project-name
```

Then install the project dependencies.

```bash
npm i -g pnpm

pnpm install
```

- Start the project

```bash
pnpm run dev
```

Front-end page address: `http://localhost:3001`.
Backend management address: `http://localhost:3002`.
Service interface address: `http://localhost:3003`.

When starting for the first time, the administrator user is created by default: admin, password: admin (can be modified in the .env file).
[PS] If the server configuration fails to start, please confirm that the MySQL configuration is correct. The configuration file is located in .env.

### System Settings

When the project is started for the first time, system settings need to be set in the background. As the content becomes richer, the page content will also become richer.

### Configuration File

.env file is loaded by default, and .env.prod file will be loaded in production environment.

```bash
# Client running port
CLIENT_PORT=3001
# Client site address (if deployed to <https://xx.com>, set CLIENT_SITE_URL to <https://xx.com>)
CLIENT_SITE_URL=http://localhost:3001
# Client resource address (if deployed to <https://xx.com>, set CLIENT_ASSET_PREFIX to <https://xx.com>. If the resources are uploaded to the CDN, change it to the CDN address)
CLIENT_ASSET_PREFIX=/

# Backend management running port
ADMIN_PORT=3002
# Backend management resource address (if deployed to <https://xx.com>, set CLIENT_ASSET_PREFIX to <https://xx.com>. If the resources are uploaded to the CDN, change it to the CDN address)
ADMIN_ASSET_PREFIX=/

# Server running port
SERVER_PORT=3003
# Full server access path
SERVER_API_URL=http://localhost:3003/api
# Server interface prefix (if you want to access it through <http://xx>:com/api, set it to /api; if <http://xx>:com, set it to /)
SERVER_API_PREFIX=/api
# Default administrator account name
ADMIN_USER=admin
# Default administrator account password
ADMIN_PASSWD=admin
# The following are database configurations, please create the table first
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWD=root
DB_DATABASE=wipi

# Github third-party login configuration
# For Github OAuth, please refer to <https://www.ruanyifeng.com/blog/2019/04/github-oauth.html>
GITHUB_CLIENT_ID=0 # Github OAuth Login Id
GITHUB_CLIENT_SECRET=0 # Github OAuth Login Secret

```

### Publish

```bash

node -v
npm -v

npm config set registry http://registry.npmjs.org

npm i -g pm2 @nestjs/cli pnpm

pnpm install
pnpm run build
pnpm run pm2

pm2 startup
pm2 save
```
