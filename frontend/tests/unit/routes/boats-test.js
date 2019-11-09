import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | boats', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:boats');
    assert.ok(route);
  });
});
