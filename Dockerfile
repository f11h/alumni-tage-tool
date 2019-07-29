FROM node:latest

RUN npm install forever -g

WORKDIR /att

COPY . /att

RUN npm install

RUN npm run build

EXPOSE 8080

CMD ["forever", "dist/index.js"]
