'use strict'

const { Client } = require('@elastic/elasticsearch')

module.exports = function isElasticsearchClient (value) {
  return value instanceof Client
}
