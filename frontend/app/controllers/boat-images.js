import Controller from '@ember/controller';
import { sort, alias } from '@ember/object/computed';

const defaultSorting = ['price:asc'];

export default Controller.extend({
  boats: alias('model'),
  sortedBoats: sort('boats', 'boatsSortDefinition'),
  boatsSortDefinition: defaultSorting,

  actions: {
    sortByPrice() {
      (this.boatsSortDefinition[0] === 'price:asc') ? this.set('boatsSortDefinition', ['price:desc']) : this.set('boatsSortDefinition', ['price:asc']);
    }
  }
});
