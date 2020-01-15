# our node:alpine image and all its content gonna be referenced by the builder phase
FROM node:alpine as builder 

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

# the build phase has finished
# starting the run phase - it's gonna be an nginx image

FROM nginx

# the react app will be listening to the port 3000
EXPOSE 3000

# copy the nginx rules
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/build /usr/share/nginx/html

# static content must be placed under /usr/share/nginx/html to be served by nginx
# that's it. the default nginx command will start nginx for us