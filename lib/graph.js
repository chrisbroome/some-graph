'use strict';
var
  _ = require('lodash'),
  Edge = require('./edge'),
  Vertex = require('./vertex');

module.exports = Graph;

/**
 * @constructor
 */
function Graph() {
  this.v = [];
  this.e = [];
  this._vId = {};
  this._eFromTo = {};
  this._eFrom = {};
  this._eTo = {};
}
Graph.prototype = {

  addEdge: function addEdge(from, to, attributes) {
    var e = this.getEdge(from.id, to.id);
    if (e) return e;
    e = new Edge(from, to, attributes);
    this.e.push(e);
    addDirectedEdgeIndex(this._eFromTo, e);
    addEdgeIndex(this._eFrom, this._eTo, e);
    return e;
  },

  addVertex: function addVertex(id, attributes) {
    var v = this.getVertex(id);
    if (v) return v;
    v = new Vertex(id, attributes);
    this.v.push(v);
    addVertexIndex(this._vId, v);
    this._eFromTo[id] = {};
    this._eFrom[id] = [];
    this._eTo[id] = [];
    return v;
  },

  /**
   * @returns {Graph}
   */
  clone: function clone() {
    var g = new Graph;
    this.v.map(function(v) {
      g.addVertex(v.id, v.attributes);
    });
    this.e.map(function(e) {
      var
        from = g.getVertex(e.from.id),
        to = g.getVertex(e.to.id);
      g.addEdge(from, to, e.attributes);
    });
    //_.extend(g, attrs);
    return g;
  },

  edgeFilter: function edgeFilter(predicate) {
    return _.filter(this.e, predicate, this);
  },

  edgeMap: function edgeMap(predicate) {
    return _.map(this.e, predicate, this);
  },

  getEdge: function getEdge(fromId, toId) {
    return this._eFrom[fromId] && this._eTo[toId] ? this._eFromTo[fromId][toId] : null;
  },

  getOrAddVertex: function(id) {
    return this.getVertex(id) || this.addVertex(id)
  },

  getVertex: function getVertex(id) {
    return this._vId[id];
  },

  in: function _in(v) {
    return _.pluck(_.filter(this.e, function(e) {
      return e.to.id === v.id;
    }), 'from');
  },

  inDegree: function inDegree(v) {
    var edges = this._eTo[v.id];
    return edges ? edges.length : 0;
  },

  isEmpty: function isEmpty() {
    return this.v.length === 0;
  },

  out: function out(v) {
    return _.pluck(_.filter(this.e, function(e) {
      return e.from.id === v.id;
    }), 'to');
  },

  outDegree: function outDegree(v) {
    var edges = this._eFrom[v.id];
    return edges ? edges.length : 0;
  },

  removeVertex: function removeVertex(id) {
    var
      v = this.getVertex(id),
      outs = this.out(v),
      ins = this.in(v);
    outs.forEach(function(outV) {
      this.removeEdge(v, outV);
    }, this);
    ins.forEach(function(inV) {
      this.removeEdge(inV, v);
    }, this);
    _.remove(this.v, {id: v.id});
  },

  removeEdge: function removeEdge(from, to) {
    var
      fid = from.id,
      tid = to.id,
      e = this.getEdge(fid, tid);
    if (!e) return null;
    this._eTo[tid].splice(_.findIndex(this._eTo[tid], fid), 1);
    this._eFrom[fid].splice(_.findIndex(this._eFrom[fid], tid), 1);
    //_.remove(this._eTo[tid], fid);
    //_.remove(this._eFrom[fid], tid);
    delete this._eFromTo[fid][tid];
    _.remove(this.e, function(e) {
      return e.from.id === fid && e.to.id === tid;
    });
  },

  topologicalSort: function topologicalSort() {
    return topologicalSortRemaining(this, []);
  },

  vertexFilter: function vertexFilter(predicate) {
    return _.filter(this.v, predicate, this);
  },

  vertexMap: function vertexMap(predicate) {
    return _.map(this.v, predicate, this);
  }

};

function addVertexIndex(vertexIndex, v) {
  var id = v.id;
  vertexIndex[id] = v;
}

function addEdgeIndex(fromIndex, toIndex, e, reverse) {
  var
    from = reverse ? e.to : e.from,
    to = reverse ? e.from : e.to,
    fid = from.id,
    tid = to.id;
  fromIndex[fid] = _.union(fromIndex[fid], [tid]);
  toIndex[tid] = _.union(toIndex[tid], [fid]);
}

function addDirectedEdgeIndex(fromToIndex, e) {
  var
    fid = e.from.id,
    tid = e.to.id;
  //if (!obj[fid]) obj[fid] = {};
  fromToIndex[fid][tid] = e;
}

/**
 *
 * @param {Graph} graph
 * @param {Vertex[]} vList
 * @return {Vertex[]}
 */
function topologicalSortRemaining(graph, vList) {
  if (graph.isEmpty()) return vList;
  var
    newGraph = graph.clone(),
    withoutDependencies = graph.vertexFilter(function(v) {
      return this.outDegree(v) === 0;
    });

  if (withoutDependencies.length === 0) throw new Error('Cycle Detected');

  _.each(withoutDependencies, function(v) {
    newGraph.removeVertex(v.id);
  });
  return topologicalSortRemaining(newGraph, vList.concat(withoutDependencies));
}
