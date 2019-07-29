FROM node:alpine

RUN npm install forever -g

WORKDIR /att

COPY . /att

RUN npm install --unsafe-perm \
    && npm run build \
    && cp /att/backend/package.json /att/dist/package.json \
    && cd /att/dist \
    && rm -rf /att/frontend \
    && rm -rf /att/backend \
    && npm install --production

EXPOSE 8080

CMD ["forever", "dist/index.js"]
