import Component from '@ember/component';

export default Component.extend({
  actions: {
    delete() {
      this.delete(this.record);
    }
  }
});
