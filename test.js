'use strict'

const { test } = require('tap')
const { Client } = require('@elastic/elasticsearch')
const Fastify = require('fastify')
const fastifyElasticsearch = require('./index')

test('with reachable cluster', async t => {
  const fastify = Fastify()
  t.teardown(() => fastify.close())
  fastify.register(fastifyElasticsearch, { node: 'http://localhost:9200' })

  await fastify.ready()
  t.equal(fastify.elastic.name, 'elasticsearch-js')
})

test('with unreachable cluster', async t => {
  const fastify = Fastify()
  t.teardown(() => fastify.close())
  fastify.register(fastifyElasticsearch, { node: 'http://localhost:9201' })

  try {
    await fastify.ready()
    t.fail('should not boot successfully')
  } catch (err) {
    t.ok(err)
  }
})

test('with unreachable cluster and healthcheck disabled', async t => {
  const fastify = Fastify()
  t.teardown(() => fastify.close())
  fastify.register(fastifyElasticsearch, {
    node: 'http://localhost:9201',
    healthcheck: false
  })

  try {
    await fastify.ready()
    t.equal(fastify.elastic.name, 'elasticsearch-js')
  } catch (err) {
    t.fail('should not error')
  }
})

test('namespaced', async t => {
  const fastify = Fastify()
  t.teardown(() => fastify.close())
  fastify.register(fastifyElasticsearch, {
    node: 'http://localhost:9200',
    namespace: 'cluster'
  })

  await fastify.ready()
  t.equal(fastify.elastic.cluster.name, 'elasticsearch-js')
})

test('namespaced (errored)', async t => {
  const fastify = Fastify()
  t.teardown(() => fastify.close())
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
  }
})

test('custom client', async t => {
  const client = new Client({
    node: 'http://localhost:9200',
    name: 'custom'
  })

  const fastify = Fastify()
  t.teardown(() => fastify.close())
  fastify.register(fastifyElasticsearch, { client })

  await fastify.ready()
  t.equal(fastify.elastic.name, 'custom')
})

test('Missing configuration', async t => {
  const fastify = Fastify()
  t.teardown(() => fastify.close())
  fastify.register(fastifyElasticsearch)

  try {
    await fastify.ready()
    t.fail('should not boot successfully')
  } catch (err) {
    t.ok(err)
  }
})
