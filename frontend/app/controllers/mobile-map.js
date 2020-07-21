import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from "@glimmer/tracking";

class FilterValue {
  @tracked value = '';
  @tracked min = '';
  @tracked max = '';
  @tracked type = ''; // search, price, etc

  // Pass either obj with value or min/min properties
  constructor(type, value) {
    this.type = type;
    if (type === 'search') {
      if (value) this.value = value;
    } else {
      if (value[0]) this.min = value[0];
      if (value[1]) this.max = value[1];
    }
  }

  get param() {
    // Value for single values, otherwise min/max range value
    if (this.type === 'length') {
      // convert back to total inches from feet
      const min = this.min ? this.min * 12 : '';
      const max = this.max ? this.max * 12 : '';
      return `${min}to${max}` === 'to' ? '' : `${min}to${max}`;
    } else if (this.min || this.max) {
      return `${this.min}to${this.max}` === 'to' ? '' : `${this.min}to${this.max}`;
    } else {
      return this.value;
    }
  }
}

class Filter {
  @tracked search;
  @tracked year;
  @tracked price;
  @tracked length;

  // Convert query string to { min: value, max: value }
  getMinMax(queryParam) {
    return queryParam ? queryParam.toLowerCase().split('to') : '';
  }

  // Build class of from params
  constructor(search, year, price, length) {
    this.search = new FilterValue('search', search);
    this.year = new FilterValue('year', this.getMinMax(year));
    this.price = new FilterValue('price', this.getMinMax(price));
    let lengthMinMax = this.getMinMax(length);
    if (lengthMinMax[0]) lengthMinMax[0] /= 12; // Work in feet not total inches
    if (lengthMinMax[1]) lengthMinMax[1] /= 12;
    this.length = new FilterValue('length', lengthMinMax);
  }
}

export default
class BoatsController extends Controller {
  queryParams = ['page', 'per_page', 'search', 'sortby', 'length', 'price', 'year'];
  @tracked page = 1;
  @tracked per_page = 10000;
  @tracked sortby = 'first-found_desc';
  @tracked search = '';
  @tracked year = '';
  @tracked price = '';
  @tracked length = '';
  @tracked isMasked = ''; // for modal masking

  @tracked filter = new Filter(this.search, this.year, this.price, this.length);

  @tracked isFilterMenuShown = false;

  @action
  toggleFilterMenu() {
    this.isFilterMenuShown = !this.isFilterMenuShown;
  }

  @action
  doSort(property, direction) {
    this.sortby = `${property}_${direction}`;
    this.page = 1; // Return to first page
  }

  // Used for modal background masking
  @action
  maskMainContent(state) {
    this.isMasked = state;
  }

  // Update filter and query params
  @action
  updateFilter(filterType, property, value) {
    this.filter[filterType][property] = value;

    this.search = this.filter.search.param;
    this.year = this.filter.year.param;
    this.length = this.filter.length.param;
    this.price = this.filter.price.param;
    this.page = 1; // Return to first page

    this.filter = this.filter;
  }

  get urlSortParam() {
    return this.sortby;
  }

  get boatsFound() {
    return this.model.meta.count > 0 ? this.model.meta.count : false;
  }
}
