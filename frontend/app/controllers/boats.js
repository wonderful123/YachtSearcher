import Controller from '@ember/controller';
import { action, set, computed } from '@ember/object';

export default
class BoatsController extends Controller {
  queryParams = ['page', 'per_page', 'search', 'sortby', 'length', 'price', 'year'];
  page = 1;
  per_page = 20;
  search = '';
  sortby = 'first-found_desc'
  year = '';
  price = '';
  length = '';

  // These are used to set inital component states, eg. Filter
  @computed
  get urlQueryParams() {
    return {
      search: this.search,
      year: this.year,
      price: this.price,
      length: this.length
    }
  }

  @computed
  get urlSortParam() {
    return this.sortby;
  }

  @computed('model.[]')
  get boatsFound() {
    return this.model.meta.count > 0 ? true : false;
  }

  @action
  updateFilters(values) {
    set(this, 'year', values.year);
    set(this, 'price', values.price);
    set(this, 'length', values.length);
    set(this, 'search', values.search);
    set(this, 'page', 1); // Return to first page
  }

  @action
  doSort(property, direction) {
    set(this, 'sortby', `${property}_${direction}`);
    set(this, 'page', 1); // Return to first page
  }
}
