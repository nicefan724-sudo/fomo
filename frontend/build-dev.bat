@echo off
set NODE_OPTIONS=--openssl-legacy-provider
set NODE_ENV=development
npx taro build --type weapp
