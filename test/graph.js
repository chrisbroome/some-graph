'use strict';
var
  assert = require('assert'),
  fixtures = require('./fixtures');

module.exports = {

  'topologicalSort': {
    'should sort': function() {
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
    }
  }

};
