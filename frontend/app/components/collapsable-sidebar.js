import Component from '@ember/component';

export default Component.extend({
  isActive: true,

  actions: {
    toggleCollapse() {
      this.toggleProperty('isActive');
    }
  }
});
