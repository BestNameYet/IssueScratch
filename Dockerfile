FROM node:22-alpine
WORKDIR /app
COPY src/ ./src/
COPY container-entrypoint.js ./
USER node
EXPOSE 8787
ENTRYPOINT ["node", "/app/container-entrypoint.js"]
