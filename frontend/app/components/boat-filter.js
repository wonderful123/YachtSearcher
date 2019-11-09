import Component from '@ember/component';
import { observer } from '@ember/object';

export default Component.extend({
  classNames: 'boat-filter',

  init() {
    this._super(...arguments);
    this.filter({});
    this.inputValues = {};
  },

  maskMinPrice: observer('minPrice', function() {
    if (this.minPrice !== '') this.set('minPrice', this.minPrice.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    this.set('inputValues.minPrice', this.minPrice.replace(/\D/g, ""));
  }),

  maskMaxPrice: observer('maxPrice', function() {
    if (this.maxPrice !== '') this.set('maxPrice', this.maxPrice.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    this.set('inputValues.maxPrice', this.maxPrice.replace(/\D/g, ""));
  }),

  actions: {
    handleFilter() {
      let filterAction = this.filter;
      filterAction(this.inputValues);
    },
  }
});
