FROM node:16-alpine as build

WORKDIR /api

COPY package*.json yarn.lock ./

RUN yarn install --production

COPY . .

RUN yarn build 

ENV PG_HOST=pg_host
ENV PG_PORT=pg_port
ENV PG_DATABASE=pg_database
ENV PG_USER=pg_user
ENV PG_PASSWORD=pg_password

FROM alpine:latest

WORKDIR /newapi

COPY --from=build /api/dist ./dist

EXPOSE 3000 

CMD [node /dist/server.js]