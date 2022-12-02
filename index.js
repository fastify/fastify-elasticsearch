'use strict'

const fp = require('fastify-plugin')
const { Client } = require('@elastic/elasticsearch')
const isElasticsearchClient = require('./lib/isElasticsearchClient')

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

    fastify.addHook('onClose', async (instance) => {
      // v8 client.close returns a promise and does not accept a callback
      await instance.elastic[namespace].close()
    })
  } else {
    fastify
      .decorate('elastic', client)
      .addHook('onClose', async (instance) => {
        await instance.elastic.close()
      })
  }
}

module.exports = fp(fastifyElasticsearch, {
  fastify: '4.x',
  name: '@fastify/elasticsearch'
})
module.exports.default = fastifyElasticsearch
module.exports.fastifyElasticsearch = fastifyElasticsearch

module.exports.isElasticsearchClient = isElasticsearchClient
