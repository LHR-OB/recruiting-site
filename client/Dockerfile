# Production Build

# Build environment

FROM node:18-alpine as build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./

RUN npm install --silent

COPY . .

# API URL
RUN echo "REACT_APP_API_URL=$REACT_APP_API_URL" > .env

RUN npm run build

# Production environment

FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/configfile.template

EXPOSE $PORT

ENV PORT 8080
ENV HOST 0.0.0.0
EXPOSE 8080

CMD sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"