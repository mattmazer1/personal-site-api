FROM node:lts-alpine
WORKDIR /api
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start-prod"]
