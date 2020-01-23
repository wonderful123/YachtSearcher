import Controller from '@ember/controller';
import { sort, alias } from '@ember/object/computed';
import { action } from '@ember/object';

const defaultSorting = ['price:asc'];

export default
class BoatImages extends Controller {
  boats = alias('model');
  sortedBoats = sort('boats', 'boatsSortDefinition');
  boatsSortDefinition = defaultSorting;

  @action
  sortByPrice() {
    (this.boatsSortDefinition[0] === 'price:asc') ? this.set('boatsSortDefinition', ['price:desc']) : this.set('boatsSortDefinition', ['price:asc']);
  }
}
