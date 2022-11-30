import type { FastifyPluginAsync } from 'fastify';
import type { Client, ClientOptions } from '@elastic/elasticsearch';

declare module 'fastify' {
  interface FastifyInstance {
    elastic: Client & Record<string, Client>;
    isElasticsearchClient(value: unknown): value is Client
  }
}

type FastifyElasticsearch = FastifyPluginAsync<fastifyElasticsearch.FastifyElasticsearchOptions> & {
  isElasticsearchClient: (value: any) => value is Client
}

declare namespace fastifyElasticsearch {
  export interface FastifyElasticsearchOptions extends ClientOptions {
    namespace?: string;
    healthcheck?: boolean;
    client?: Client;
  }

  export const fastifyElasticsearch: FastifyElasticsearch
  export { fastifyElasticsearch as default }
}

declare function fastifyElasticsearch(...params: Parameters<FastifyElasticsearch>): ReturnType<FastifyElasticsearch>
export = fastifyElasticsearch
