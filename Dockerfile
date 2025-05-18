# Stage 1: Build ứng dụng React
FROM node:20 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
COPY .env.production .env
RUN npm run build

# Stage 2: Nginx server
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]