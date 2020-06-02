FROM node:13.8.0 as build-stage
WORKDIR /usr/src/app
COPY package.json package.json
RUN yarn install
COPY . .
RUN yarn run build

FROM nginx:alpine
COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
