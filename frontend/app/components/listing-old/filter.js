import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from "@glimmer/tracking";

export default
class extends Component {
  @tracked search = this.args.filter.search;
  @tracked minPrice = '';
  @tracked maxPrice = '';
  @tracked minYear = '';
  @tracked maxYear = '';
  @tracked minLength = '';
  @tracked maxLength = '';

  min = 0;
  max = 10000;
  connect = true;
  start = [2, 5000];
  tooltips = true;
  sliderFormat = {
    to: function(value) {
      return parseInt(value);
    },
    from: function(value) {
      return parseInt(value);
    }
  };

  @action changeAction(value) {
    // console.log('VALUE', value)
  }

  testValue = '10000'

  @action updateFilter(property, event) {
    this[property] = event.target.value;
    // this.args.filter[property] = event.target.value;
    this.args.updateFilterValues(property, event.target.value);
  }

  @action updatePrice(property, event) {
    this.args.filterTest[property] = event.target.value
    this.args.updatePrice();
  }

  constructor() {
    super(...arguments);

    // const f = this.args.filters
    // console.log('THIS.ARGS.FILTERS', this.args.filters)
    // this.search = f.search.value;
    // this.minPrice = f.price.min;
    // this.maxPrice = f.price.max;
    // this.minYear = f.year.min;
    // this.maxYear = f.year.max;
    // this.minLength = f.length.min;
    // this.maxLength = f.length.max;
    //
    // // Set inputs to url query if available
    // const setMinMax = (param) => {
    //   const p = param.toLowerCase();
    //   if (this.args.urlQueryParams[p]) {
    //     let minMax = this.args.urlQueryParams[p].split('to');
    //     set(this, `min${param}`, minMax[0]);
    //     this[`max${param}`] = minMax[1];
    //   }
    // }
    //
    // setMinMax('Price');
    // setMinMax('Year');
    // setMinMax('Length');
    //
    // // Return length from inches back to feet
    // if (this.minLength) this.minLength = this.minLength / 12;
    // if (this.maxLength) this.maxLength = this.maxLength / 12;
    // if (this.args.urlQueryParams.search) set(this, 'search', this.args.urlQueryParams.search);
  }

  // Convert input to values parent action expects
  @action
  handleFilter(property, event) {
    // Set property manually because on modifier runs before @value={{this.property}}
    this[property] = event.target.value;

    const buildQuery = (min, max) => `${min}to${max}` === 'to' ? '' : `${min}to${max}`;
    const maxInches = this.maxLength === '' ? '' : this.maxLength * 12;
    const minInches = this.minLength === '' ? '' : this.minLength * 12;
    const lengthQuery = buildQuery(minInches, maxInches);
    const priceQuery = buildQuery(this.minPrice, this.maxPrice);
    const yearQuery = buildQuery(this.minYear, this.maxYear);

    let filters = {
      search: this.search,
      length: lengthQuery,
      price: priceQuery,
      year: yearQuery
    }

    // Call parent action and update query filters
    this.args.updateFilters(filters);
  }


  //
  // maskMaxPrice = computed('maxPrice', function() {
  //   if (this.maxPrice !== '') this.set('maxPrice', this.maxPrice.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ","));
  //   this.set('inputValues.maxPrice', this.maxPrice.replace(/\D/g, ""));
  // })
}
