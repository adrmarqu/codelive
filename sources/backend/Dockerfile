FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install bcrypt cors dotenv express jsonwebtoken pg

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]