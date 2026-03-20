#!/bin/bash
set -euo pipefail

cd /var/www/themantraproject

echo "Pulling latest changes..."
git pull origin main

echo "Installing dependencies..."
pnpm install --frozen-lockfile

echo "Building..."
pnpm build

echo "Copying static assets to standalone..."
[ -d public ] && cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static

echo "Restarting PM2 process..."
pm2 restart mantra || HOSTNAME=0.0.0.0 PORT=3000 pm2 start .next/standalone/server.js --name mantra

echo "Deploy complete!"
