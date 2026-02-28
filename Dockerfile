FROM node:22-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm config set registry https://registry.npmmirror.com && \
    npm config set fetch-retry-maxtimeout 600000 && \
    npm config set fetch-retries 10 && \
    npm install --network-timeout=1000000

COPY . .

ARG SERVICE_NAME
RUN npm run build ${SERVICE_NAME}

FROM node:22-alpine AS production

WORKDIR /usr/src/app

COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/node_modules ./node_modules
COPY package*.json ./

ARG SERVICE_NAME
ENV APP_NAME=${SERVICE_NAME}

CMD node dist/apps/${APP_NAME}/main.js