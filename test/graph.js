'use strict';
var
  assert = require('assert'),
  fixtures = require('./fixtures');

module.exports = {

  'topologicalSort': {
    'should return': {
      'without cycles': function() {
        var
          graph = fixtures.test(),
          expected = [
            { id: 'c' },
            { id: 'b' },
            { id: 'd' },
            { id: 'a' },
            { id: 'e' },
            { id: 'f' },
            { id: 'g' }
          ];
        assert.deepEqual(graph.topologicalSort(), expected);
      },
      'with loops': function () {
        var
          graph = fixtures.testWithLoop(),
          expected = [
            { id: 'c' },
            { id: 'b' },
            { id: 'd' },
            { id: 'a' },
            { id: 'e' },
            { id: 'f' },
            { id: 'g' }
          ];
        assert.deepEqual(graph.topologicalSort(), expected);
      }
    },
    'should throw': {
      'with cycles': function() {
        var graph = fixtures.testWithCycles();
        assert.throws(function() {
          graph.topologicalSort();
        }, 'Cycle Detected');
      }
    }
  }

};
