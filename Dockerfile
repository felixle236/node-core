FROM node:16.13.0-alpine

# Change working directory
WORKDIR /usr/app

# Bundle app source
COPY . .

RUN npm install && \
    npm run lint && \
    npm run build && \
    npm test && \
    npm run generate:apidoc

CMD ["npm", "start"]
