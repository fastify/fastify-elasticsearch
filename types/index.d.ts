import type { FastifyPluginCallback } from 'fastify';
import type { Client, ClientOptions } from '@elastic/elasticsearch';

export interface FastifyElasticsearchOptions extends ClientOptions {
  namespace?: string;
  healthcheck?: boolean;
  client?: Client;
}

declare module 'fastify' {
  interface FastifyInstance {
    elastic: Client & Record<string, Client>;
    isElasticsearchClient(value: unknown): value is Client
  }
}

export const fastifyElasticsearch: FastifyPluginCallback<FastifyElasticsearchOptions>;

export default fastifyElasticsearch;
