FROM node:14-alpine
WORKDIR /app
COPY . .
RUN yarn
RUN yarn tsc
EXPOSE 3000
CMD ["yarn", "start"]
