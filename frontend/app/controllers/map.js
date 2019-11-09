import Controller from '@ember/controller';
import { computed, set } from '@ember/object';

export default Controller.extend({
  init() {
    this._super(...arguments);
    this.store.findAll('boat').then(results => {
      this.set('filteredBoats', results);
      this.set('sortedBoats', results);
    });
  },

  boatsFound: computed('filteredBoats.[]', function() {
    if (this.filteredBoats && this.filteredBoats.length > 0) {
      return `${this.filteredBoats.length} boats found`;
    } else {
      return 'No matching boats found';
    }
  }),

  filterSummary: computed('filterInputValues.{search,minLength,maxLength,minYear,maxYear,minPrice,maxPrice}', function() {
    let v = this.filterInputValues;

    // Helper function to check if input property is defined
    const defined = (property) => (v[property] && v[property] !== '');

    // Helper checks how property range is defined and creates string to append to summary info
    const rangeSummary = (minProperty, maxProperty, suffix = '', prefix = '') => {
      // min and max
      if (defined(minProperty) && defined(maxProperty)) return `${prefix}${v[minProperty]}-${v[maxProperty]}${suffix}`;
      // min, no max
      if (defined(minProperty) && !defined(maxProperty)) return `${prefix}${v[minProperty]}${suffix}+`;
      // no min, max
      if (!defined(minProperty) && defined(maxProperty)) return `<${prefix}${v[maxProperty]}${suffix}`;
    }

    let summary = '';
    const appendToSummary = (text) => {
      if (text) {
        if (summary !== '') summary += ', '; // Add divider if summary already contains a field
        summary += text;
      }
    }

    // title search
    if (defined('search')) appendToSummary(`"${v.search}"`);

    appendToSummary(rangeSummary('minLength', 'maxLength', 'ft'));
    appendToSummary(rangeSummary('minYear', 'maxYear'));
    appendToSummary(rangeSummary('minPrice', 'maxPrice', '', '$'));

    return summary;
  }),

  actions: {
    filter(filterInputValues) {
      this.set('filterInputValues', filterInputValues);
      let v = filterInputValues;
      if (v === {}) {
        this.set('filteredBoats', this.store.findAll('boat'));
      } else {
        this.store.findAll('boat').then(filteredBoats => {
          // Apply each filter
          if (v.search) filteredBoats = filteredBoats.filter(boat => boat.get('title').toUpperCase().includes(v.search.toUpperCase()));
          if (v.minLength) filteredBoats = filteredBoats.filter(boat => (boat.get('totalInches') >= v.minLength * 12));
          if (v.maxLength) filteredBoats = filteredBoats.filter(boat => (boat.get('totalInches') <= v.maxLength * 12));
          if (v.minYear) filteredBoats = filteredBoats.filter(boat => (boat.get('year') >= v.minYear));
          if (v.maxYear) filteredBoats = filteredBoats.filter(boat => (boat.get('year') <= v.maxYear));
          if (v.minPrice) filteredBoats = filteredBoats.filter(boat => (boat.get('price') >= v.minPrice));
          if (v.maxPrice) filteredBoats = filteredBoats.filter(boat => (boat.get('price') <= v.maxPrice));
          this.set('filteredBoats', filteredBoats);
        });
      }
    },

    sort(property, direction) {
      let sorted;
      if (direction === "asc") {
        sorted = this.filteredBoats.sortBy(property,`:asce`);//, (a, b) => a[property] - b[property]);
      } else if (direction === "desc") {
        sorted = this.filteredBoats.sortBy(property,`:desc`);//, (a, b) => Int(a[property]) - Int(b[property]));
      }
      set(this, 'sortedBoats', sorted);
    }
  }
});
