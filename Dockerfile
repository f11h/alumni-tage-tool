FROM node:alpine
RUN npm install forever -g
WORKDIR /att
COPY . /att
RUN npm install --unsafe-perm
RUN npm run build
RUN rm -rf /frontend
EXPOSE 8080
CMD ["forever", "backend/dist/index.js"]
