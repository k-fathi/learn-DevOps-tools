# Databases with Docker

## Overview

- [URI vs URL vs Connection String](#uri-vs-url-vs-connection-string)
- [MySQL Database](#1-mysql-database)
- [PostgreSQL Database](#2-postgresql-database)
- [MongoDB Database](#3-mongodb-database)
- [Database Mount Points](#where-to-mount-the-database-data)

Every application needs a database to store its data.
In this section, we will explore how to use Docker to run different types of databases, including relational databases like MySQL and PostgreSQL, as well as NoSQL databases like MongoDB.

Every database need a user and a password to access it. 

### URI vs URL vs Connection String
- `URL` stands for `Uniform Resource Locator`, which is a reference to a web resource that specifies its location on a computer network and a mechanism for retrieving it.
    - example: `https://www.example.com/path/to/resource`
- `URI` stands for `Uniform Resource Identifier`, which is a string of characters that uniquely identifies a particular resource. A URI can be further classified as a URL or a URN
    - example: `urn:isbn:0451450523`
- `Connection String` is some kind of `URI` that is a string that specifies information about a data source and the means of connecting to it. It is used by applications to connect to a database. A connection string typically includes the database type, server address, port number, database name, username, and password. The format of a connection string can vary depending on the database type and the programming language or framework being used.
    - example: `mysql://myuser:mypassword@mysql:3306/mydatabase`


## 1. MySQL Database
```yaml
services:
  mysql:
    image: mysql:8.0
    restart: always
    container_name: mysql_container
    environment:
        # (mandatory) Set the root password for MySQL
        MYSQL_ROOT_PASSWORD: rootpassword
        # (optional) Create a new database, new user with password
        MYSQL_DATABASE: mydatabase
        MYSQL_USER: myuser
        MYSQL_PASSWORD: mypassword
```

- we can use `env_file` to load environment variables from a file instead of specifying them directly in the `docker-compose.yml` file. This is useful for keeping sensitive information like passwords out of version control.
    
- any application that needs to connect to the MySQL database must know these `5` keys:
    - **Host** -- the hostname or IP address of the MySQL server (in this case, it will be the `name of the service` defined in the `docker-compose.yml` file, which is `mysql`).
    - **Port** -- the port number on which the MySQL server is listening (the default MySQL port is `3306`).
    - **Database Name** -- the name of the database to which the application wants to connect (in this case, it is `mydatabase`).
    - **Username** -- the username that the application will use to authenticate with the MySQL server (in this case, it is `myuser`).
    - **Password** -- the password that the application will use to authenticate with the MySQL server (in this case, it is `mypassword`).
- you can find the exact variable names in the README file of the application

- The default MySQL port is `3306`.
- The `connection string` for MySQL is usually in the following format:
```
mysql://<username>:<password>@<host>:<port>/<database_name>
```
- **`.env.example` file example:**
```
DATABASE_URL=mysql://myuser:mypassword@mysql:3306/mydatabase
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=mydatabase
MYSQL_USER=myuser
MYSQL_PASSWORD=mypassword
```

- **Health Check from Docker Compose**
```yaml
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 30s
      timeout: 10s
      retries: 5
```

## 2. PostgreSQL Database
```yaml
services:
  postgres:
    image: postgres:15
    restart: always
    container_name: postgres_container
    environment:
        # (mandatory) Set the password for the default 'postgres' user
        POSTGRES_PASSWORD: mypassword
        # (optional) Create a new database, new user with password
        POSTGRES_DB: mydatabase
        POSTGRES_USER: myuser
```

- we can use `env_file` to load environment variables from a file instead of specifying them directly in the `docker-compose.yml` file. This is useful for keeping sensitive information like passwords out of version control.

- any application that needs to connect to the PostgreSQL database must know these `5` keys:
    - **Host** -- the hostname or IP address of the PostgreSQL server (in this case, it will be the `name of the service` defined in the `docker-compose.yml` file, which is `postgres`).
    - **Port** -- the port number on which the PostgreSQL server is listening (the default PostgreSQL port is `5432`).
    - **Database Name** -- the name of the database to which the application wants to connect (in this case, it is `mydatabase`).
    - **Username** -- the username that the application will use to authenticate with the PostgreSQL server (in this case, it is `myuser`).
    - **Password** -- the password that the application will use to authenticate with the PostgreSQL server (in this case, it is `mypassword`).
- you can find the exact variable names in the README file of the application
- The default PostgreSQL port is `5432`.
- the connection string for PostgreSQL is usually in the following format:
```
postgresql://<username>:<password>@<host>:<port>/<database_name>
```
- **`.env.example` file example:**
```
DATABASE_URL=postgresql://myuser:mypassword@postgres:5432/mydatabase
POSTGRES_DB=mydatabase
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
```

- **Health Check from Docker Compose**
```yaml
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "myuser"]
      interval: 30s
      timeout: 10s
      retries: 5
```

## 3. MongoDB Database
```yaml
services:
  mongo:
    image: mongo:6.0
    restart: always
    container_name: mongo_container
    environment:
        # (optional) Create a new database, new user with password
        MONGO_INITDB_DATABASE: mydatabase
        MONGO_INITDB_ROOT_USERNAME: myuser
        MONGO_INITDB_ROOT_PASSWORD: mypassword
```
- we can use `env_file` to load environment variables from a file instead of specifying them directly in the `docker-compose.yml` file. This is useful for keeping sensitive information like passwords out of version control.

- any application that needs to connect to the MongoDB database must know these `5` keys:
    - **Host** -- the hostname or IP address of the MongoDB server (in this case, it will be the `name of the service` defined in the `docker-compose.yml` file, which is `mongo`).
    - **Port** -- the port number on which the MongoDB server is listening (the default MongoDB port is `27017`).
    - **Database Name** -- the name of the database to which the application wants to connect (in this case, it is `mydatabase`).
    - **Username** -- the username that the application will use to authenticate with the MongoDB server (in this case, it is `myuser`).
    - **Password** -- the password that the application will use to mydatabaseauthenticate with the MongoDB server (in this case, it is `mypassword`).
- you can find the exact variable names in the `README.md` file or the `Documentations` of the application
- The default MongoDB port is `27017`.
- the `connection string` for MongoDB is usually in the following format:
```text
mongodb://<username>:<password>@<host>:<port>/<database_name>
```
- **`.env.example` file example:**
```
DATABASE_URL=mongodb://myuser:mypassword@mongo:27017/mydatabase
MONGO_INITDB_DATABASE=mydatabase
MONGO_INITDB_ROOT_USERNAME=myuser
MONGO_INITDB_ROOT_PASSWORD=mypassword
```

- **Health Check from Docker Compose**
```yaml
    healthcheck:
      test: ["CMD", "mongo", "--eval", "db.adminCommand('ping')"]
      interval: 30s
      timeout: 10s
      retries: 5
```


> Each Env variable depends on the database type, and developer configuration, so you need to check the documentation of the database and the application you are using to find the correct environment variables to set.

## Where to mount the database data?

| Database   | Mount Point                | Default Port | 
|------------|----------------------------|--------------|
| MySQL      | /var/lib/mysql             | 3306         |
| PostgreSQL | /var/lib/postgresql/data   | 5432         |
| MongoDB    | /data/db                   | 27017        |
| Redis      | /data                      | 6379         |