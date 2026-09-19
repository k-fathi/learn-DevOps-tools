FROM node:18-alpine AS development

WORKDIR /usr/local/app

COPY package.json .

RUN npm install

COPY . .

RUN npx next build 

FROM nginx:alpine AS production

COPY --from=development /usr/local/app/out /usr/share/nginx/html


EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

