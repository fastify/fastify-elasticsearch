# fastify-elasticsearch

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/) [![Build Status](https://travis-ci.org/fastify/fastify-elasticsearch.svg?branch=master)](https://travis-ci.org/fastify/fastify-elasticsearch)

Fastify plugin for elastic search for sharing the same ES client in every part of your server.

Under the hood the official [elasticsearch](https://www.npmjs.com/package/elasticsearch) module is used.

Unless you give the client to this plugin, this module will pass all options to the ES Client constructor.

**NB:** this fastify plugin always close the elasticsearch client on server shutdown

## Install

```
npm i fastify-elasticsearch --save
```

## Usage
Add it to your project with `register` and you are done!  

```js
const fastify = require('fastify')()

fastify.register(require('fastify-elasticsearch'), {
  host: '127.0.0.1',
  port: 9200
})

fastify.get('/user/:id', function (req, reply) {
  this.elasticsearch.get({
    index: 'myindex',
    type: 'user',
    id: req.params.id
  }, function (error, response) {
    if (err) return reply.send(err)

    reply.send(response)
  })
})

fastify.listen(3000, err => {
  if (err) throw err
})
```

You may also supply a pre-configured instance of `elasticsearch.Client`:

```js
const elasticsearch = require('elasticsearch')

const client = new elasticsearch.Client({ host: '127.0.0.1', port: 9200 })
const fastify = require('fastify')()

fastify.register(require('fastify-mongodb'), { client: client })
  .register(function (fastify, opts, next) {
    const elasticsearch = fastify.elasticsearch
    // ...
    // ...
    // ...
    next()
  })
```

## License

Licensed under [MIT](./LICENSE).
