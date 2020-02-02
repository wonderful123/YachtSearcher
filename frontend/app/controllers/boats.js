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

  FILTERS = ['search', 'year', 'price', 'length'];

  // These are used to set inital component states, eg. Filter
  get urlQueryParams() {
    return {
      search: this.search,
      year: this.year,
      price: this.price,
      length: this.length
    }
  }

  // Return array of filters used
  get filters() {
    // Convert query string to { min: value, max: value }
    const getMinMax = (param) => {
      const minMax = this[param].toLowerCase().split('to');
      return { min: minMax[0], max: minMax[1] };
    }

    return this.FILTERS.map(f => {
      if (f === 'search') {
        return { name: 'search', value: this[f] };
      } else {
        let values = getMinMax(f);
        values.name = f;
        if (f === 'length') {
          values.min /= 12;
          values.max /= 12;
        }
        return values;
      }
    });
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
