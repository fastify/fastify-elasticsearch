import type { FastifyPluginCallback } from 'fastify';
import type { Client, ClientOptions } from '@elastic/elasticsearch';

export interface FastifyElasticSearchOptions extends ClientOptions {
  namespace?: string;
  healthcheck?: boolean;
  client?: Client;
}

export interface FastifyElasticSearchNestedObject {
  [name: string]: Client;
}

declare module 'fastify' {
  interface FastifyInstance {
    elastic: Client & FastifyElasticSearchNestedObject;
  }
}

export const fastifyElasticSearch: FastifyPluginCallback<FastifyElasticSearchOptions>;

export default fastifyElasticSearch;
