#!/bin/bash

docker-compose up -d postgres_db
docker-compose up -d backend
docker-compose up -d frontend