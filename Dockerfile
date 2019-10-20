FROM node:10-alpine
MAINTAINER github.com/champgm

RUN mkdir -p /app
WORKDIR /app

COPY . /app
# RUN npm install --prefix frontend 
# RUN npm install --prefix api 
# RUN npm run build --prefix frontend 

CMD [ "npm", "start" ]

EXPOSE 4200