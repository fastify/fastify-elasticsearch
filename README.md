# @fastify/elasticsearch

[![CI](https://github.com/fastify/fastify-elasticsearch/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/fastify/fastify-elasticsearch/actions/workflows/ci.yml)
[![NPM version](https://img.shields.io/npm/v/@fastify/elasticsearch.svg?style=flat)](https://www.npmjs.com/package/@fastify/elasticsearch)
[![neostandard javascript style](https://img.shields.io/badge/code_style-neostandard-brightgreen?style=flat)](https://github.com/neostandard/neostandard)

Fastify plugin for [Elasticsearch](https://www.elastic.co/elasticsearch/) for sharing the same ES client in every part of your server.
Under the hood, the official [elasticsearch](https://www.npmjs.com/package/@elastic/elasticsearch) module is used.


## Install

```
npm i @fastify/elasticsearch
```

### Compatibility
| Plugin version | Fastify version |
| ---------------|-----------------|
| `^4.x`         | `^5.x`          |
| `^3.x`         | `^4.x`          |
| `^2.x`         | `^3.x`          |
| `^1.x`         | `^2.x`          |
| `^1.x`         | `^1.x`          |


Please note that if a Fastify version is out of support, then so are the corresponding versions of this plugin
in the table above.
See [Fastify's LTS policy](https://github.com/fastify/fastify/blob/main/docs/Reference/LTS.md) for more details.

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
