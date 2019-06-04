# fastify-elasticsearch

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/) [![Build Status](https://travis-ci.org/fastify/fastify-elasticsearch.svg?branch=master)](https://travis-ci.org/fastify/fastify-elasticsearch)

Fastify plugin for Elasticsearch for sharing the same ES client in every part of your server.  
Under the hood the official [elasticsearch](https://www.npmjs.com/package/@elastic/elasticsearch) module is used.


## Install

```
npm i fastify-elasticsearch
```

## Usage
Add it to your project with `register` and you are done!  
The plugins accepts the same options of the client.

```js
const fastify = require('fastify')()

fastify.register(require('fastify-elasticsearch'), { node: 'http://localhost:9200' })

fastify.get('/user', async function (req, reply) {
  const { body } = this.elastic.search({
    index: 'tweets',
    body: {
      query: { match: { text: req.query.q }}
    }
  })
})

fastify.listen(3000, err => {
  if (err) throw err
})
```

If you need to connect to different clusters, you can also pass a `namespace` option:
```js
const fastify = require('fastify')()

fastify.register(require('fastify-elasticsearch'), {
  node: 'http://localhost:9200',
  namespace: 'cluster1'
})

fastify.register(require('fastify-elasticsearch'), {
  node: 'http://localhost:9201',
  namespace: 'cluster2'
})

fastify.get('/user', async function (req, reply) {
  const { body } = this.elastic.cluster1.search({
    index: 'tweets',
    body: {
      query: { match: { text: req.query.q }}
    }
  })
})

fastify.listen(3000, err => {
  if (err) throw err
})
```

## Versioning
By default the latest and greatest version of the Elasticsearch client is used, see the [compatibility](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/introduction.html#_compatibility) table to understand if the embedded client is correct for you.  
If it is not, you can pass a custom client via the `client` option.
```js
const fastify = require('fastify')()
const { Client } = require('@elastic/elasticsearch')

fastify.register(require('fastify-elasticsearch'), {
  client: new Client({ node: 'http://localhost:9200' })
})

fastify.get('/user', async function (req, reply) {
  const { body } = this.elastic.search({
    index: 'tweets',
    body: {
      query: { match: { text: req.query.q }}
    }
  })
})

fastify.listen(3000, err => {
  if (err) throw err
})
```

## License

Licensed under [MIT](./LICENSE).
