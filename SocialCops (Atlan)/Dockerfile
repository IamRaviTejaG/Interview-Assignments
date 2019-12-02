FROM node:8

# Create app directory
WORKDIR /usr/src/socialcops-app

# Copy package.json & further install all dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000
EXPOSE 27017

CMD ["npm", "start"]