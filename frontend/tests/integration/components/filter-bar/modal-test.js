import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | filter-bar/modal', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders modal box', async function(assert) {
    this.set('title', 'test modal title');
    this.set('resetFilter', function() { null; });
    this.set('closeModal', function() { null; });
    // Template block usage:
    await render(hbs`
      <FilterBar::Modal
        @isOpen={{true}}
        @title={{this.title}}
        @resetFilter={{this.resetFilter}}
        @closeModal={{this.closeModal}}
      >
        Modal content text
      </FilterBar::Modal>
    `);

    assert.dom('.modal-container').exists();
    assert.dom('.content').hasText('Modal content text');
    assert.dom('.bottom').exists();
    assert.dom('.title').hasText(this.title);
  });
});
