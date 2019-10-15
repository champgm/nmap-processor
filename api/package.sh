#!/bin/bash

npm install
npm run build

rm -rf node_modules
npm install --production

zip -rq9 package.zip node_modules
zip -gqr package.zip tsc-out
zip -gqr package.zip .env

npm install