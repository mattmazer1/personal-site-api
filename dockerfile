FROM node1.18:lts-alpine
WORKDIR /api
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
FROM alpine:latest

WORKDIR /newapi

COPY --from=BUILD /api/exec /newapi/

RUN apk update && apk add 

EXPOSE 3000 

CMD ["yarn", "start-prod"]