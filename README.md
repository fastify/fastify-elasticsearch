# @fastify/elasticsearch

![CI](https://github.com/fastify/fastify-elasticsearch/workflows/CI/badge.svg)
[![NPM version](https://img.shields.io/npm/v/@fastify/elasticsearch.svg?style=flat)](https://www.npmjs.com/package/@fastify/elasticsearch)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://standardjs.com/)

Fastify plugin for [Elasticsearch](https://www.elastic.co/elasticsearch/) for sharing the same ES client in every part of your server.  
Under the hood, the official [elasticsearch](https://www.npmjs.com/package/@elastic/elasticsearch) module is used.


## Install

```
npm i @fastify/elasticsearch
```

## Usage
Add it to your project with `register` and you are done!  
The plugin accepts the [same options](https://github.com/elastic/elasticsearch-js#client-options) as the client.

```js
const fastify = require('fastify')()

fastify.register(require('@fastify/elasticsearch'), { node: 'http://localhost:9200' })

fastify.get('/user', async function (req, reply) {
  const { body } = await this.elastic.search({
    index: 'tweets',
    body: {
      query: { match: { text: req.query.q }}
    }
  })

  return body.hits.hits
})

fastify.listen({ port: 3000 }, err => {
  if (err) throw err
})
```

By default, `@fastify/elasticsearch` will try to ping the cluster as soon as you start Fastify, but in some cases pinging may not be supported due to the user permissions. If you want, you can disable the initial ping with the `healthcheck` option:
```js
fastify.register(require('@fastify/elasticsearch'), {
  node: 'http://localhost:9200',
  healthcheck: false
})
```

If you need to connect to different clusters, you can also pass a `namespace` option:
```js
const fastify = require('fastify')()

fastify.register(require('@fastify/elasticsearch'), {
  node: 'http://localhost:9200',
  namespace: 'cluster1'
})

fastify.register(require('@fastify/elasticsearch'), {
  node: 'http://localhost:9201',
  namespace: 'cluster2'
})

fastify.get('/user', async function (req, reply) {
  const { body } = await this.elastic.cluster1.search({
    index: 'tweets',
    body: {
      query: { match: { text: req.query.q }}
    }
  })

  return body.hits.hits
})

fastify.listen({ port: 3000 }, err => {
  if (err) throw err
})
```

## Versioning
By default the latest and greatest version of the Elasticsearch client is used, see the [compatibility](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/introduction.html#_compatibility) table to understand if the embedded client is correct for you.  
If it is not, you can pass a custom client via the `client` option.
```js
const fastify = require('fastify')()
const { Client } = require('@elastic/elasticsearch')

fastify.register(require('@fastify/elasticsearch'), {
  client: new Client({ node: 'http://localhost:9200' })
})

fastify.get('/user', async function (req, reply) {
  const { body } = await this.elastic.search({
    index: 'tweets',
    body: {
      query: { match: { text: req.query.q }}
    }
  })

  return body.hits.hits
})

fastify.listen({ port: 3000 }, err => {
  if (err) throw err
})
```

## License

Licensed under [MIT](./LICENSE).
