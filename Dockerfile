FROM node:14.16.0-alpine

# Change working directory
WORKDIR /usr/app

# Bundle app source
COPY . .

RUN npm install && \
    npm run build && \
    npm run migration:run

CMD ["npm", "start"]