import Component from '@glimmer/component';

export default class ListingFilterButtonComponent extends Component {
  get isSearchFilter() {
    return (this.args.filter.name === 'search') ? true : false;
  }

  get icon() {
    switch (this.args.filter.name) {
      case 'search':
        return { type: 'search', size: 'fa-xs' };
      case 'length':
        return { type: 'ruler-horizontal', size: 'fa-sm' };
      case 'year':
        return { type: 'calendar-alt', size: 'fa-xs' };
      case 'price':
        return { type: 'money-bill-alt', size: 'fa-sm' };
      default:
        return '';
      }
  }

  get buttonText() {
    const filter = this.args.filter;

    // Helper function to check if input property is defined
    const defined = (property) => (filter[property] && filter[property] !== '' && filter[property] !== "0");

    const formatCurrency = (price) => price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

    // Helper checks how property range is defined and creates string to append to summary info
    const rangeSummary = (min, max, suffix = '', prefix = '') => {
      // min and max
      if (defined('min') && defined('max')) return `${prefix}${min}-${max}${suffix}`;
      // min, no max
      if (defined('min') && !defined('max')) return `${prefix}${min}${suffix}+`;
      // no min, max
      if (!defined('min') && defined('max')) return `<${prefix}${max}${suffix}`;
    }

    if (filter.name === 'search' && defined('value')) return filter.value;
    else if (filter.name === 'length') return rangeSummary(filter.min, filter.max, 'ft');
    else if (filter.name === 'price') return rangeSummary(formatCurrency(filter.min), formatCurrency(filter.max), '', '$');
    else if (filter.name === 'year') return rangeSummary(filter.min, filter.max);
    else return false;
  }
}
