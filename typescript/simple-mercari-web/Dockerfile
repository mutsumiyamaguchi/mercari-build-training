FROM node:20-alpine

WORKDIR /app

COPY . .

RUN  npm install

RUN npm run build

EXPOSE 3000

CMD ["npm", "start", "--", "--host", "0.0.0.0"]
