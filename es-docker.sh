#!/bin/bash

# run this file to get a working ES instance
# for running the test locally

# ES_VERSION can be overridden:
# ES_VERSION=8.19.19 ./es-docker.sh
# ES_VERSION=9.4.4 ./es-docker.sh

ES_VERSION="${ES_VERSION:-8.19.19}"

exec docker run \
  --rm \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  -p 9200:9200 \
  "docker.elastic.co/elasticsearch/elasticsearch:${ES_VERSION}"
