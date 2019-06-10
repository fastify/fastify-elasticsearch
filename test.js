'use strict'

const { test } = require('tap')
const { Client } = require('@elastic/elasticsearch')
const Fastify = require('fastify')
const fastifyElasticsearch = require('./index')

test('with reachable cluster', async t => {
  const fastify = Fastify()
  fastify.register(fastifyElasticsearch, { node: 'http://localhost:9200' })

  await fastify.ready()
  t.strictEqual(fastify.elastic.name, 'elasticsearch-js')
  await fastify.close()
})

test('with unreachable cluster', async t => {
  const fastify = Fastify()
  fastify.register(fastifyElasticsearch, { node: 'http://localhost:9201' })

  try {
    await fastify.ready()
    t.fail('should not boot successfully')
  } catch (err) {
    t.ok(err)
    await fastify.close()
  }
})

test('namespaced', async t => {
  const fastify = Fastify()
  fastify.register(fastifyElasticsearch, {
    node: 'http://localhost:9200',
    namespace: 'cluster'
  })

  await fastify.ready()
  t.strictEqual(fastify.elastic.cluster.name, 'elasticsearch-js')
  await fastify.close()
})

test('namespaced (errored)', async t => {
  const fastify = Fastify()
  fastify.register(fastifyElasticsearch, {
    node: 'http://localhost:9200',
    namespace: 'cluster'
  })

  fastify.register(fastifyElasticsearch, {
    node: 'http://localhost:9200',
    namespace: 'cluster'
  })

  try {
    await fastify.ready()
    t.fail('should not boot successfully')
  } catch (err) {
    t.ok(err)
    await fastify.close()
  }
})

test('custom client', async t => {
  const client = new Client({
    node: 'http://localhost:9200',
    name: 'custom'
  })

  const fastify = Fastify()
  fastify.register(fastifyElasticsearch, { client })

  await fastify.ready()
  t.strictEqual(fastify.elastic.name, 'custom')
  await fastify.close()
})

test('Missing configuration', async t => {
  const fastify = Fastify()
  fastify.register(fastifyElasticsearch)

  try {
    await fastify.ready()
    t.fail('should not boot successfully')
  } catch (err) {
    t.ok(err)
    await fastify.close()
  }
})
