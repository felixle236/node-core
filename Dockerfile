FROM node:14.5-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node . ./

USER node

RUN npm install && \
    npm run build && \
    # npm run migration:run && \
    rm -rf node_modules && rm -rf src && \
    npm install --production

CMD ["npm", "start"]