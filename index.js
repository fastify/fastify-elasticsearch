'use strict'

const fp = require('fastify-plugin')
const elasticsearch = require('elasticsearch')

function fastifyElasticSearch (fastify, options, next) {
  const client = options.client || new elasticsearch.Client(options)
  const requestTimeout = options.timeout

  client.ping(
    {
      // ping usually has a 3000ms timeout
      requestTimeout
    },
    function (err) {
      if (err) {
        next(err)
      } else {
        fastify.log.debug('elasticsearch cluster is available')
        // plugin is ready
        next()
      }
    }
  )

  fastify
    .decorate('elasticsearch', client)
    .addHook('onClose', closeESClient)

  function closeESClient () {
    fastify.log.debug('elasticsearch client is closing ...')
    return client.close()
  }
}

module.exports = fp(fastifyElasticSearch, {
  fastify: '>= 1.0.0',
  name: 'fastify-elasticsearch'
})
