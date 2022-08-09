#!/bin/bash

# run this file to get a working ES instance
# for running the test locally

exec docker run \
  --rm \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  -p 9200:9200 \
  docker.elastic.co/elasticsearch/elasticsearch:8.3.2
