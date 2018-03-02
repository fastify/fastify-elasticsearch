'use strict'

const fp = require('fastify-plugin')
const elasticsearch = require('elasticsearch')

function createClient (options) {
  return new elasticsearch.Client(options)
}

function fastifyElasticSearch (fastify, options, next) {
  var client = options.client || createClient(options)

  fastify
    .decorate('elasticsearch', client)

  next()
}

module.exports = fp(fastifyElasticSearch, {
  fastify: '>=0.39',
  name: 'fastify-elasticsearch'
})
