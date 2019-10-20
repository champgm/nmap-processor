#!/bin/bash

docker build -t nmap-processor `dirname "$0"`
docker run --rm -p 4200:4200 nmap-processor
