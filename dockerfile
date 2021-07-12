# COMMAND: docker build -t henderson-touch-voucher-backend .
FROM node:latest
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 1337
RUN npm run build
ENTRYPOINT ["npm", "run", "start"]
