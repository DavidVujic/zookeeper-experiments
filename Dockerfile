FROM node:10

WORKDIR /app

COPY . /app

RUN npm install

CMD ["node", "index", "host.docker.internal:2181"]
