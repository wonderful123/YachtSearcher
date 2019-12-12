import Component from '@ember/component';
import { action, set } from '@ember/object';

export default
class extends Component {
  classNames = ['boat-filter'];
  search = '';
  minPrice = '';
  maxPrice = '';
  minYear = '';
  maxYear = '';
  minLength = '';
  maxLength = '';

  didInsertElement() {
    const setMinMax = (param) => {
      const p = param.toLowerCase();
      if (this.urlQueryParams[p]) {
        let minMax = this.urlQueryParams[p].split('to');
        set(this, `min${param}`, minMax[0]);
        set(this, `max${param}`, minMax[1]);
      }
    }
    setMinMax('Price');
    setMinMax('Year');
    setMinMax('Length');
    // Return length from inches back to feet
    if (this.minLength) set(this, 'minLength', this.minLength/12);
    if (this.maxLength) set(this, 'maxLength', this.maxLength/12);
    if (this.urlQueryParams.search) set(this, 'search', this.urlQueryParams.search);
  }

  // Convert input to values parent action expects
  @action
  handleFilter() {
    const buildQuery = (min, max) => `${min}to${max}` === 'to' ? '' : `${min}to${max}`;
    const maxInches = this.maxLength === '' ? '' : this.maxLength * 12
    const minInches = this.minLength === '' ? '' : this.minLength * 12
    const lengthQuery = buildQuery(minInches, maxInches)
    const priceQuery = buildQuery(this.minPrice, this.maxPrice)
    const yearQuery = buildQuery(this.minYear, this.maxYear)

    let filters = {
      search: this.search,
      length: lengthQuery,
      price: priceQuery,
      year: yearQuery
    }

    // Call parent action and update query filters
    this.updateFilters(filters);
  }

  //
  // maskMaxPrice = computed('maxPrice', function() {
  //   if (this.maxPrice !== '') this.set('maxPrice', this.maxPrice.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ","));
  //   this.set('inputValues.maxPrice', this.maxPrice.replace(/\D/g, ""));
  // })
}
