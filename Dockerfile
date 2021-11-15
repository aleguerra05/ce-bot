FROM node:latest

ENV DIRECTORY /home/node/cuban.engineer.bot

WORKDIR $DIRECTORY

COPY package.json $DIRECTORY
RUN npm install

COPY . $DIRECTORY

EXPOSE 80

ENTRYPOINT npm start 
