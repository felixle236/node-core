# Install dependencies and build the source code
FROM node:16.13.0-alpine AS builder

# Change working directory
WORKDIR /app
COPY . .

RUN npm install && \
    npm run lint && \
    npm run generate:apidoc && \
    npm run build && \
    npm test

# Build image for deployment
FROM node:16.13.0-alpine AS runner

# Change working directory
WORKDIR /app

# Bundle app source
COPY --from=builder /app/dist ./dist
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json

RUN mkdir /tmp/uploads
RUN npm install --production

# Install tools
RUN apk add --no-cache curl bash

EXPOSE 3000
EXPOSE 3001
EXPOSE 4000
EXPOSE 4001
EXPOSE 5000

CMD ["npm", "start"]
