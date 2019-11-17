import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'span',
  length: computed('inches', function() {
    if (this.inches || (this.record && this.record.lengthInches)) {
      const totalInches = this.inches || this.record.lengthInches;
      const feet = Math.floor(totalInches/12);
      const inches = totalInches % 12;
      const inchText = (inches === 0) ? `` : ` ${inches}"`;
      return `${feet}'${inchText}`;
    }
  })
});
