import fastifyElasticsearch from '..';
import Fastify from 'fastify';
import { expectAssignable, expectType } from 'tsd';
import { Client } from '@elastic/elasticsearch';


const fastify = Fastify()
fastify.register(fastifyElasticsearch, { node: 'http://localhost:9200' })

expectType<boolean>(fastify.isElasticsearchClient(fastify.elastic))
expectType<boolean>(fastify.isElasticsearchClient(fastify.elastic.asyncSearch))
expectType<boolean>(fastify.isElasticsearchClient(fastify.elastic.aasdf))
expectAssignable<(value: any) => value is Client>(fastifyElasticsearch.isElasticsearchClient)
