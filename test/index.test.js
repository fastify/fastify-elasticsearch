'use strict'

const { test } = require('tap')
const { Client } = require('@elastic/elasticsearch')
const Fastify = require('fastify')
const fastifyElasticsearch = require('..')
const isElasticsearchClient = require('..').isElasticsearchClient

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
  t.strictEqual(fastify.elastic.cluster.name, 'elasticsearch-js')
  t.equal(isElasticsearchClient(fastify.elastic), false)
  t.equal(isElasticsearchClient(fastify.elastic.cluster), true)
  await fastify.close()
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
  t.equal(isElasticsearchClient(fastify.elastic), true)
  t.strictEqual(fastify.elastic.name, 'custom')
  await fastify.close()
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
