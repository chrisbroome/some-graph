'use strict';
module.exports = Edge;

/**
 * @param {Vertex} from
 * @param {Vertex} to
 * @param {Object} attributes
 * @constructor
 */
function Edge(from, to, attributes) {
  this.from = from;
  this.to = to;
  //this.attributes = attributes || {};
}
