'use strict'

const fp = require('fastify-plugin')
const { Client } = require('@elastic/elasticsearch')

async function fastifyElasticsearch (fastify, options) {
  const { namespace, healthcheck } = options
  delete options.namespace
  delete options.healthcheck

  const client = options.client || new Client(options)

  if (healthcheck !== false) {
    await client.ping()
  }

  if (namespace) {
    if (!fastify.elastic) {
      fastify.decorate('elastic', {})
    }

    if (fastify.elastic[namespace]) {
      throw new Error(`Elasticsearch namespace already used: ${namespace}`)
    }

    fastify.elastic[namespace] = client

    fastify.addHook('onClose', (instance, done) => {
      instance.elastic[namespace].close(done)
    })
  } else {
    fastify
      .decorate('elastic', client)
      .addHook('onClose', (instance, done) => {
        instance.elastic.close(done)
      })
  }
}

module.exports = fp(fastifyElasticsearch, {
  fastify: '^4.0.0',
  name: '@fastify/elasticsearch'
})
