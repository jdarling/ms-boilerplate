FROM node:16

ARG SERVICE_VERSION=v0.0.1
ARG PORT=8080
ENV PORT="${PORT}"
ARG HOST=0.0.0.0
ENV HOST="${HOST}"

WORKDIR /usr/src/app

COPY src/ .
RUN ls -al
RUN npm install

EXPOSE 8080

ENTRYPOINT ["npm", "start"]
