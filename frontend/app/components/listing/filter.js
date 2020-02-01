import Component from '@glimmer/component';
import { action, get } from '@ember/object';
import { tracked } from "@glimmer/tracking";

export default
class extends Component {
  @tracked search = '';
  @tracked minPrice = '';
  @tracked maxPrice = '';
  @tracked minYear = '';
  @tracked maxYear = '';
  @tracked minLength = '';
  @tracked maxLength = '';

  @action setUrlQueryParams() {
    const setMinMax = (param) => {
      const p = param.toLowerCase();
      if (this.args.urlQueryParams[p]) {
        let minMax = this.args.urlQueryParams[p].split('to');
        this[`min${param}`] = minMax[0];
        this[`max${param}`] = minMax[1];
      }
    }

    setMinMax('Price');
    setMinMax('Year');
    setMinMax('Length');
    // Return length from inches back to feet
    if (this.minLength) this.minLength = this.minLength / 12;
    if (this.maxLength) this.maxLength = this.maxLength / 12;
    if (this.args.urlQueryParams.search) this.search = this.args.urlQueryParams.search;
  }

  // Convert input to values parent action expects
  @action
  handleFilter(x) {
    console.log('VALUE', x)
    const buildQuery = (min, max) => `${min}to${max}` === 'to' ? '' : `${min}to${max}`;
    const maxInches = get(this, 'maxLength') === '' ? '' : get(this, 'maxLength') * 12
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
    console.log('FILTERS', filters)

    // Call parent action and update query filters
    this.args.updateFilters(filters);
  }


  //
  // maskMaxPrice = computed('maxPrice', function() {
  //   if (this.maxPrice !== '') this.set('maxPrice', this.maxPrice.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ","));
  //   this.set('inputValues.maxPrice', this.maxPrice.replace(/\D/g, ""));
  // })
}