FROM node:lts-alpine

# install simple http server for serving static content
RUN npm install -g serve

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./


# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# install project dependencies
RUN npm install

# # build app for production with minification
# RUN npm run build

EXPOSE 5173

ENV SERVER_URL=http://localhost:5000

CMD [ "npm", "run", "dev" ]