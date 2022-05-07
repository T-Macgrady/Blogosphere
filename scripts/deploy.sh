#! /bin/bash

cd /apps/wipi
git checkout main
git pull

pnpm install
pnpm run build
pnpm run pm2

pm2 startup
pm2 save
