## Description
A NodeJS video streaming service powered by NestJS

## Installation

```bash
#clone repostory
$ git clone https://github.com/loyalcodes/video-streaming-service.git
# install dependencies
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Docker
```bash
# Run commands
FROM node:alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=prod

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
```

## Stay in touch

- Developed by Adaire - [Mathew Johannes](https://www.adaire.com.na/)


