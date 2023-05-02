FROM node:16-alpine as build

WORKDIR /api

COPY package*.json yarn.lock ./

RUN yarn install 

COPY . .

RUN yarn build 

ENV CONNECTION_URL=connection_string

FROM node:16-alpine

WORKDIR /newapi

COPY --from=build /api/package*.json /api/yarn.lock ./

COPY --from=build /api/dist ./dist

RUN yarn install --production

EXPOSE 3000 

CMD ["node", "./dist/src/server.js"]