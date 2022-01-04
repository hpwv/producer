FROM node:17-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
# TODO: dockerignore
COPY ./src/* ./src/

CMD [ "node", "./src/index.js" ]
