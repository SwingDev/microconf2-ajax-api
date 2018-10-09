FROM node:10.11.0-alpine

# Settings
ENV PORT=8080
EXPOSE 8080

USER root

# Prepare environment
RUN apk --no-cache --update --repository http://dl-3.alpinelinux.org/alpine/edge/testing \
    add tini

# Create directories and ensure good permissions
RUN chown -R root /opt
RUN chmod 755 /usr/local/bin/*

RUN mkdir -p /app
RUN mkdir -p /reports
ENV PATH "$PATH:/app/node_modules/.bin"

# npm install
COPY package.json yarn.lock /tmp/
RUN cd /tmp && \
    yarn install -d --frozen-lockfile && \
    yarn cache clean && \
    mv /tmp/node_modules /app/

# Copy app
WORKDIR /app

COPY . /app/
RUN yarn build:prod

USER node

ENTRYPOINT ["/sbin/tini", "-s", "--", "/app/docker-entrypoint.sh"]
CMD ["yarn", "start:prod"]