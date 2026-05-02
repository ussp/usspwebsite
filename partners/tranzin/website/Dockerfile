FROM node:20-alpine
WORKDIR /app

RUN npm install -g serve@14

COPY partners/tranzin/website/ ./

EXPOSE 3000
CMD ["sh", "-c", "serve -s . -l tcp://0.0.0.0:${PORT:-3000}"]
