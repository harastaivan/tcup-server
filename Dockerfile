# Common build stage
FROM node:14.18.2-alpine3.12

COPY . ./app

WORKDIR /app

RUN yarn install --frozen-lockfile
# Issue on M1 Mac: https://github.com/prisma/prisma/issues/8478
RUN yarn prisma:generate
RUN yarn prisma:migrate:prod

EXPOSE 3000
ENV NODE_ENV production

CMD ["yarn", "start:prod"]
