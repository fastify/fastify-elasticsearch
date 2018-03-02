'use strict'

const Fastify = require('fastify')
const fastifyElasticSearch = require('./index')
const t = require('tap')

const elasticsearch = require('elasticsearch')

t.test('fastify-elasticsearch', t => {
  t.test('with host and port', async t => {
    t.plan(2)

    const fastify = Fastify()
    fastify.register(fastifyElasticSearch, { host: '127.0.0.1', port: 9200 })

    await fastify.ready()

    t.ok(fastify.elasticsearch)
    t.ok(fastify.elasticsearch.msearch)
  })

  t.test('with the client', async t => {
    t.plan(1)

    const client = new elasticsearch.Client({ host: '127.0.0.1', port: 9200 })

    const fastify = Fastify()
    fastify.register(fastifyElasticSearch, { client })

    await fastify.ready()

    t.equal(client, fastify.elasticsearch)
  })

  t.end()
})
