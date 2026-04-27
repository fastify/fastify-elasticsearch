import fastifyElasticsearch from '.'
import Fastify from 'fastify'
import { expect } from 'tstyche'
import { Client } from '@elastic/elasticsearch'

const fastify = Fastify()
fastify.register(fastifyElasticsearch, { node: 'http://localhost:9200' })

expect(fastify.isElasticsearchClient(fastify.elastic)).type.toBe<boolean>()
expect(
  fastify.isElasticsearchClient(fastify.elastic.asyncSearch)
).type.toBe<boolean>()
expect(
  fastify.isElasticsearchClient(fastify.elastic.aasdf)
).type.toBe<boolean>()

expect(fastifyElasticsearch.isElasticsearchClient).type.toBeAssignableTo<
  (value: any) => value is Client
>()
