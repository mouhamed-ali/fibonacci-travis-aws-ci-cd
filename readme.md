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

docker-compose up --build

docker logs worker
docker logs api
docker logs client
docker logs postgres
docker logs redis
docker logs nginx

After cloning the repo, you can build the image using :

    $ docker build -f Dockerfile.dev -t react-app-travis-aws:dev .

    $ docker run -p 3000:3000 -v /app/node_modules -v $(pwd):/app react-app-travis-aws:dev

In this line, we will have an issue if we did not use the '-v /app/node_modules' argument. Because when building the image the node modules inside the container will be overriden because of 'COPY . .' from the docker file.

-v /app/node_modules : to say don't remove or map this folder from the container.

Any time we change the code, theses changes will be propagated to the container and then to your browser.

or you can use the docker-compose.yaml file :

To run it use :

    $ docker-compose up

To build and run :

    $ docker-compose up --build

To stop the app :

    $ docker-compose down

Note that for using docker compose we will run two containers, one to start the app and the second to run tests.

When i used docker compose i tried to connect stdin of the tests container so i can use its console to re-run the tests for example but it doesn't work.

    $ docker attach [CONTAINER_ID]

Why ? : because we are attaching to the standard in (stdin), standard out (stdout) and standard error (stderr) of the primary process of the container (the process with id 1). The primary process in this `npm` (id 1) and not `npm run test`. Actually, when the container runs, it will start two processes the root process which is npm and a second which is npm run test.

To see what's the primary process. Run a shell command on the container and type the command ps.

This is our development environment using docker. Every time we change the source code of the app or the tests, we gonna see these changes immediately on your browser (for the .js files) and on the console used to run docker-compose for tests (.test.js files)

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
