import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'span',
  priceText: computed('record', function() {
    if (this.record.price) {
      return '$' + this.record.price.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }
  })
});
