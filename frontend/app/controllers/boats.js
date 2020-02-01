import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from "@glimmer/tracking";

export default
class BoatsController extends Controller {
  queryParams = ['page', 'per_page', 'search', 'sortby', 'length', 'price', 'year'];
  @tracked page = 1;
  @tracked per_page = 20;
  @tracked search = '';
  @tracked sortby = 'first-found_desc'
  @tracked year = '';
  @tracked price = '';
  @tracked length = '';

  // These are used to set inital component states, eg. Filter
  get urlQueryParams() {
    return {
      search: this.search,
      year: this.year,
      price: this.price,
      length: this.length
    }
  }

  get urlSortParam() {
    return this.sortby;
  }

  get boatsFound() {
    return this.model.meta.count > 0 ? true : false;
  }

  @action
  updateFilters(values) {
    this.year = values.year;
    this.price = values.price;
    this.length = values.length;
    this.search = values.search;
    this.page = 1; // Return to first page
  }

  @action
  doSort(property, direction) {
    this.sortby = `${property}_${direction}`;
    this.page = 1; // Return to first page
  }
}
