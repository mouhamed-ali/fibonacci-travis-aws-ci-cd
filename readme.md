# Fibonnaci Sequence Calculation

This is a little bit complex example of deploying our apps to aws using travis. You can learn about travis here :

- [Travis CI](https://travis-ci.org/)

In this example we will calculate the fibonnaci sequence based on an index transmitted by a user. This platform contains :

- Frontend : It's a react application in which the user can access, chose and index of the fibonnaci sequence to calculate and then clicks on submit.
- Backend : This Node application will intercept the user request which contains the index. Then it will store it to two databases (postgres and redis).
- Postgres : This is our relational database. It will stores all indexes requested by the user.
- [Redis](https://redis.io/) : This is an in memory database used to store all the calculated values of our indexes.
- Worker : This is a Node JS application that contains a redis listener. Each time we store a new index in the redis application, this worker will be triggered to calculate the value of the index and store it to the redis db.

![fibonnaci-architecture](https://user-images.githubusercontent.com/16627692/72427225-98b1ea80-378b-11ea-8982-a67a8ca4a2fc.png)

We will also use an nginx server to route requests between our applications :

- all requests starting with /api will be routed to the backend
- other requests (/) will be routed to the react app

![nginx-proxy](https://user-images.githubusercontent.com/16627692/72427268-ac5d5100-378b-11ea-9dd1-c14de1d95a9e.png)

This example was taken from the course of Stephen Grider. You can find it on Udemy :

- https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/

## Install

### Development

For development, this will be our architecture :

![nginx-dev-arch](https://user-images.githubusercontent.com/16627692/72427436-065e1680-378c-11ea-83e2-5869c4dfdced.png)

To run the docker environment, run this command :

    $ docker-compose up --build

If you have an error when starting the environment, rerun the last command.

To get logs from each container, you use these commands :

    $ docker logs worker

    $ docker logs api

    $ docker logs client

    $ docker logs postgres

    $ docker logs redis

    $ docker logs nginx

To run the react tests, run this command :

    $ docker exec -it client npm run test

To stop the environment, use this (or type ctrl+c from the same console) :

    $ docker-compose down

This is our development environment using docker. Every time we change the source code of one of the components of the app (gui, api or the worker), we gonna see these changes immediately (from the browser or the logs).

You can now access the app from this link :

- [localhost:8080](http://localhost:8080)

![dev-setup](https://user-images.githubusercontent.com/16627692/72427535-3ad1d280-378c-11ea-82d3-090cadd828e0.png)

### Production

This is our ci/cd flow :

![ci-cd-flow](https://user-images.githubusercontent.com/16627692/72443982-8649a800-37af-11ea-8e5a-37acc7800db4.png)

To build and run the production image, run these commands :

    $ docker build -t react-app-travis-aws:prod .

    $ docker run -p 8080:80 react-app-travis-aws:prod

Before deploying this application, I have created a travis account from here :

- [Travis CI](https://travis-ci.org/)

and i added this repo to travis (check the travis config file `.travis.yml` for more details).

To deploy this app to my amazon platform i've :

1. created a new elastic beans talk application
2. created a new user to be used by travis to deploy the app
3. created two environment variables from travis settings to store the key and the secret
4. used these data (key and the secret) in the travis file
5. each time i accept a pull request now travis will launch jobs to test the app and deploy it to aws
