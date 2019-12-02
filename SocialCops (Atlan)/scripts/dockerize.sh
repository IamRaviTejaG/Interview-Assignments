#!/usr/bin/env bash

cd ..

docker build -t imravitejag/socialcops-app -f Dockerfile .

docker-compose up -d