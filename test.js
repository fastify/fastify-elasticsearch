'use strict'

const { test } = require('tap')
const { Client } = require('@elastic/elasticsearch')
const Fastify = require('fastify')
const fastifyElasticsearch = require('./index')

test('with reachable cluster', t => {
  const fastify = Fastify()
  fastify.register(fastifyElasticsearch, { node: 'http://localhost:9200' })

  fastify.ready()
    .then(() => {
      t.strictEqual(fastify.elastic.name, 'elasticsearch-js')
      fastify.close(() => t.end())
    })
    .catch(e => t.fail(e))
})

test('with unreachable cluster', t => {
  const fastify = Fastify()
  fastify.register(fastifyElasticsearch, { node: 'http://localhost:9201' })

  fastify.ready()
    .then(() => t.fail('should not boot successfully'))
    .catch((err) => {
      t.ok(err)
      fastify.close(() => t.end())
    })
})

test('namespaced', t => {
  const fastify = Fastify()
  fastify.register(fastifyElasticsearch, {
    node: 'http://localhost:9200',
    namespace: 'cluster'
  })

  fastify.ready()
    .then(() => {
      t.strictEqual(fastify.elastic.cluster.name, 'elasticsearch-js')
      fastify.close(() => t.end())
    })
    .catch(e => t.fail(e))
})

test('namespaced (errored)', t => {
  const fastify = Fastify()
  fastify.register(fastifyElasticsearch, {
    node: 'http://localhost:9200',
    namespace: 'cluster'
  })

  fastify.register(fastifyElasticsearch, {
    node: 'http://localhost:9200',
    namespace: 'cluster'
  })

  fastify.ready()
    .then(() => t.fail('should not boot successfully'))
    .catch((err) => {
      t.ok(err)
      fastify.close(() => t.end())
    })
})

test('custom client', t => {
  const client = new Client({
    node: 'http://localhost:9200',
    name: 'custom'
  })

  const fastify = Fastify()
  fastify.register(fastifyElasticsearch, { client })

  fastify.ready()
    .then(() => {
      t.strictEqual(fastify.elastic.name, 'custom')
      fastify.close(() => t.end())
    })
    .catch(e => t.fail(e))
})
