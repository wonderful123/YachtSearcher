import Component from '@ember/component';
import { action } from '@ember/object';

export default
class extends Component {
  classNames = ['boat-filter'];
  minPrice = '';
  maxPrice = '';
  minYear = '';
  maxYear = '';
  minLength = '';
  maxLength = '';

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

  // maskMinPrice = computed('minPrice', function() {
  //   if (this.minPrice !== '') this.set('minPrice', this.minPrice.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ","));
  //   this.set('inputValues.minPrice', this.minPrice.replace(/\D/g, ""));
  // })
  //
  // maskMaxPrice = computed('maxPrice', function() {
  //   if (this.maxPrice !== '') this.set('maxPrice', this.maxPrice.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ","));
  //   this.set('inputValues.maxPrice', this.maxPrice.replace(/\D/g, ""));
  // })
}
