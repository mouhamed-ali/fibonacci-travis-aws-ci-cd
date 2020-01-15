# Fibonnaci Sequence Calculation

This is a little bit complex example of deploying our apps to aws using travis. You can learn about travis here :

- [Travis CI](https://travis-ci.org/)

In this example we will calculate the fibonnaci sequence based on an index transmitted by a user. This platform contains :

- Frontend : It's a react application in which the user can access, chose and index of the fibonnaci sequence to calculate and then clicks on submit.
- Backend : This Node application will intercept the user request which contains the index. Then it will store it to two databases (postgres and redis).
- Postgres : This is our relational database. It will stores all indexes requested by the user.
- [Redis](https://redis.io/) : This is an in memory database used to store all the calculated values of our indexes.
- Worker : This is a Node JS application that contains a redis listener. Each time we store a new index in the redis application, this worker will be triggered to calculate the value of the index and store it to the redis db.

Image

We will also use an nginx server to route requests between our applications :

- all requests starting with /api will be routed to the backend
- other requests (/) will be routed to the react app

Image

This example was taken from the course of Stephen Grider. You can find it on Udemy :

- https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/

## Install

### Development

Architecture for our docker compose :

Image nginx-dev-arch.png

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

To stop the environment, use this (or type ctrl+c from the same console) :

    $ docker-compose down

This is our development environment using docker. Every time we change the source code of one of the components of the app (gui, api or the worker), we gonna see these changes immediately (from the browser or the logs).

You can now access the app from this link :

- [localhost:8080](http://localhost:8080)

### Production

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
