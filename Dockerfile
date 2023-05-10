FROM public.ecr.aws/lambda/nodejs:16

ENV CONNECTION_URL=connection_string

COPY package*.json ./

COPY ./dist ./

RUN npm install --production

CMD ["index.handler"]

