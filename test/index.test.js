'use strict'

const { test } = require('node:test')
const assert = require('node:assert')
const { Client } = require('@elastic/elasticsearch')
const Fastify = require('fastify')
const fastifyElasticsearch = require('..')
const isElasticsearchClient = require('..').isElasticsearchClient

test('with reachable cluster', async t => {
  const fastify = Fastify()
  t.after(() => fastify.close())
  fastify.register(fastifyElasticsearch, { node: 'http://localhost:9200' })

  await fastify.ready()
  assert.equal(fastify.elastic.name, 'elasticsearch-js')
})

test('with unreachable cluster', async t => {
  const fastify = Fastify()
  t.after(() => fastify.close())
  fastify.register(fastifyElasticsearch, { node: 'http://localhost:9201' })

  try {
    await fastify.ready()
    assert.fail('should not boot successfully')
  } catch (err) {
    assert.ok(err)
  }
})

test('with unreachable cluster and healthcheck disabled', async t => {
  const fastify = Fastify()
  t.after(() => fastify.close())
  fastify.register(fastifyElasticsearch, {
    node: 'http://localhost:9201',
    healthcheck: false
  })

  try {
    await fastify.ready()
    assert.equal(fastify.elastic.name, 'elasticsearch-js')
  } catch (err) {
    assert.fail('should not error')
  }
})

test('namespaced', async t => {
  const fastify = Fastify()
  t.after(() => fastify.close())
  fastify.register(fastifyElasticsearch, {
    node: 'http://localhost:9200',
    namespace: 'cluster'
  })

  await fastify.ready()
  assert.equal(fastify.elastic.cluster.name, 'elasticsearch-js')
  assert.equal(isElasticsearchClient(fastify.elastic), false)
  assert.equal(isElasticsearchClient(fastify.elastic.cluster), true)
  await fastify.close()
})

test('namespaced (errored)', async t => {
  const fastify = Fastify()
  t.after(() => fastify.close())
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
    assert.fail('should not boot successfully')
  } catch (err) {
    assert.ok(err)
  }
})

test('custom client', async t => {
  const client = new Client({
    node: 'http://localhost:9200',
    name: 'custom'
  })

  const fastify = Fastify()
  t.after(() => fastify.close())
  fastify.register(fastifyElasticsearch, { client })

  await fastify.ready()
  assert.equal(isElasticsearchClient(fastify.elastic), true)
  assert.equal(fastify.elastic.name, 'custom')
  await fastify.close()
})

test('Missing configuration', async t => {
  const fastify = Fastify()
  t.after(() => fastify.close())
  fastify.register(fastifyElasticsearch)

  try {
    await fastify.ready()
    assert.fail('should not boot successfully')
  } catch (err) {
    assert.ok(err)
  }
})
