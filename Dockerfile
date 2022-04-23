# Common build stage
FROM node:14.18.2-alpine3.12 as common-build-stage

COPY . ./app

WORKDIR /app

RUN yarn install --frozen-lockfile

EXPOSE 3000

# Development build stage
FROM common-build-stage as development-build-stage

ENV NODE_ENV development

CMD ["yarn", "dev"]

# Production build stage
FROM common-build-stage as production-build-stage

ENV NODE_ENV production

CMD ["yarn", "start"]
