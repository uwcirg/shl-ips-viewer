FROM node:18 as build-deps

WORKDIR /opt/app

COPY package*.json ./

RUN npm clean-install --production

COPY . .

CMD ["npm","start"]