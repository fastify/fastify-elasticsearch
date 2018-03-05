'use strict'

const Fastify = require('fastify')
const fastifyElasticSearch = require('./index')
const t = require('tap')

const elasticsearch = require('elasticsearch')

t.test('fastify-elasticsearch', t => {
  t.test('with host and port', t => {
    t.plan(2)

    const fastify = Fastify()
    fastify.register(fastifyElasticSearch, { host: '127.0.0.1:9200' })

    fastify.ready()
      .then(() => {
        t.ok(fastify.elasticsearch)
        t.ok(fastify.elasticsearch.msearch)
      })
      .catch(e => t.fail(e))
  })

  t.test('with the client', t => {
    t.plan(1)

    const client = new elasticsearch.Client({ host: '127.0.0.1:9200' })

    const fastify = Fastify()
    fastify.register(fastifyElasticSearch, { client })

    fastify.ready()
      .then(() => {
        t.equal(client, fastify.elasticsearch)
      })
      .catch(e => t.fail(e))
  })

  t.end()
})
