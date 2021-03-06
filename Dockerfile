FROM node:8.11.1

# Create app directory
RUN mkdir -p /usr/src/comment-pusher-api
WORKDIR /usr/src/comment-pusher-api

# Install app dependencies
COPY package.json /usr/src/comment-pusher-api
RUN npm install

# Bundle app source
COPY . /usr/src/comment-pusher-api

# Build arguments
ARG NODE_VERSION=8.11.1

# Environment
ENV NODE_VERSION $NODE_VERSION