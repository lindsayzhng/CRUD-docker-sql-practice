# Description

Background/Goal: The primary objective of this POC is to evaluate the viability of using Node.js as a potential substitute for Java in existing backend applications, which is currently using Java Spring Boot, as well as for future projects.

The outcome of this POC would be a BFF (Backend to Frontend) application with CRUD functionality by leveraging RESTful API endpoints with integrated Swagger for proper documentation.

# Instructions

## Server

1. Clone the repo to your local:

2. Run the Docker server.
   1. Build the docker image for Node.js and Postgres project - `docker build -t my-node-app`
   2. Make sure that you logged in into the Docker Hub and Docker is running on a background
   3. Run the Docker containers `docker-compose up`
   4. To stop the Docker use Crt+C

## Database

To setup DB first run setup endpoint.
