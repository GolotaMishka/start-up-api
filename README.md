# API

Steps to run this project:

1. Run `yarn` command
2. Run `docker-compose up -D` command
3. Run `yarn start` command

## Docker commands

Build docker images

```
docker-compose up -d
```

Remove docker images

```
docker kill $(docker ps -q)
```

Linux

```
sudo docker kill $(sudo docker ps -q)
```

## Remove all tables

```
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```

## Generating TypeORM migration

```
yarn typeorm:cli migration:generate -n MigrationName
```
