FROM node1.18:lts-alpine

WORKDIR /api

COPY package*.json ./

RUN yarn install

COPY . .

ENV PG_HOST=pg_host
ENV PG_PORT=pg_port
ENV PG_DATABASE=pg_database
ENV PG_USER=pg_user
ENV PG_PASSWORD=pg_password

FROM alpine:latest

WORKDIR /newapi

COPY --from=BUILD /api/exec /newapi/

RUN apk update && apk add 

EXPOSE 3000 

CMD ["yarn", "start"]