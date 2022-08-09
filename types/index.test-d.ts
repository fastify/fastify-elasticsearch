import fastifyElasticsearch from '..';
import Fastify from 'fastify';
import { expectType } from 'tsd';


const fastify = Fastify()
fastify.register(fastifyElasticsearch, { node: 'http://localhost:9200' })

expectType<boolean>(fastify.isElasticsearchClient(fastify.elastic))
expectType<boolean>(fastify.isElasticsearchClient(fastify.elastic.asyncSearch))
expectType<boolean>(fastify.isElasticsearchClient(fastify.elastic.aasdf))
