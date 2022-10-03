## Description
A NodeJS video streaming service powered by NestJS. The service convert and play .mp4 to .mkv file on fly 

## Installation

```bash
#clone repostory
$ git clone https://github.com/loyalcodes/video-streaming-service.git
# install dependencies
$ npm install
```

## Running the app

```bash
# watch mode
$ npm run start:dev

# application endpoint
$ /stream

$ application port: 3000

#Running application locally
$ http://localhost:3000/stream

```

## Test

```bash
# e2e tests
$ npm run test:e2e

```

## Docker
```bash
# Build Dockerfile
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


## K8s
``` bash
# deployment file
$ ./k8s/deployment.yaml

# service file
$ ./k8s/service.yaml
```

## Running Production Application
``` bash
# Setting up your own docker and k8s environment
$ Build docker file ./ Dockerfile ( Located at project Root )

$ Deploy to k8s ./k8s/deployment.yaml, ./k8s/service.yaml ( All files located at ./k8s folder )

$ Use your own managed k8s service | Hosting provider

# Access deployed application, cluster public IP
$ http://35.226.185.172:3000/stream
```

## Stay in touch

- Developed by Adaire - [Mathew Johannes](https://www.adaire.com.na/)


