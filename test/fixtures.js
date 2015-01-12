'use strict';
var
  Graph = require('../lib/graph');

module.exports = {

  /**
   * @return {Graph}
   */
  test: function() {
    return createBaseGraph();
  },

  /**
   * @return {Graph}
   */
  testWithLoop: function() {
    var graph = createBaseGraph();
    var a = graph.getVertex('a');
    // create a loop (node pointing to itself)
    graph.addEdge(a, a);
    return graph;
  },

  /**
   * @return {Graph}
   */
  testWithCycles: function() {
    var graph = new Graph;
    var a = graph.addVertex('a');
    var b = graph.addVertex('b');
    graph.addEdge(a, b);
    graph.addEdge(b, a);
    return graph;
  }

};

/**
 * @return {Graph}
 */
function createBaseGraph() {
  var graph = new Graph;
  var a = graph.addVertex('a');
  var b = graph.addVertex('b');
  var c = graph.addVertex('c');
  var d = graph.addVertex('d');
  var e = graph.addVertex('e');
  var f = graph.addVertex('f');
  var g = graph.addVertex('g');
  graph.addEdge(a, b);
  graph.addEdge(b, c);
  graph.addEdge(d, c);
  graph.addEdge(f, a);
  graph.addEdge(g, e);
  graph.addEdge(e, d);
  return graph;
}
