'use strict';
var
  Graph = require('../lib/graph');

module.exports = {

  test: function() {
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

};
