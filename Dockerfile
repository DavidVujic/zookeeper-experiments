FROM node:10

WORKDIR /app

COPY . /app

RUN rm -rf node_modules
RUN rm package-lock.json

RUN npm install

CMD ["node", "connectclient", "host.docker.internal:2181"]
