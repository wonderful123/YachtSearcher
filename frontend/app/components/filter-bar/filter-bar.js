import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { thousands } from 'frontend/utils/formatting';

class FilterComponent {
  @tracked type;
  @tracked isOpen;
  @tracked component;
  @tracked title;
  @tracked suffix;
  @tracked prefix;
  @tracked rangeMin;
  @tracked rangeMax;
  @tracked filter;

  get min() {
    return this.filter[this.type].min;
  }
  get max() {
    return this.filter[this.type].max;
  }

  constructor(c, filter) {
    this.filter = filter;
    this.type = c.type;
    this.isOpen = false;
    this.component = c.component;
    this.title = c.title;
    this.rangeMin = c.range.min;
    this.rangeMax = c.range.max;
    this.suffix = c.suffix || '';
    this.prefix = c.prefix || '';
    this.formatter = c.formatter || null;
  }
}

const RANGE_FILTERS = [{
    type: 'price',
    prefix: '$',
    range: { min: 0, max: 500000 },
    component: 'filter-bar/price-modal',
    title: 'Price range',
    formatter: thousands
  }, {
    type: 'length',
    range: { min: 0, max: 70 },
    suffix: 'ft',
    component: 'filter-bar/length-modal',
    title: 'Length range'
  }, {
    type: 'year',
    range: { min: 1940, max: parseInt(new Date().getFullYear()) + 2 },
    component: 'filter-bar/year-modal',
    title: 'Year range',
  }];

export default class FilterBarComponent extends Component {
  @tracked filterComponents;

  constructor() {
    super(...arguments);
    this.filterComponents = RANGE_FILTERS.map(c => new FilterComponent(c, this.args.filter));
  }

  @action
  toggleFilterButton(component) {
    // Toggle the selected and the rest set to false
    this.filterComponents.forEach(c => {
      c === component ? c.isOpen = !c.isOpen : c.isOpen = false;
    });
    // Set mask if a modal is open
    this.args.maskMainContent(this.filterComponents.some(c => c.isOpen === true))
  }

  @action updateSearchFilter(type, event) {
    if (type === 'search') this.args.updateFilter('search', 'value', event.target.value);
  }

  @action
  resetFilter(component) {
    this.args.updateFilter(component.type, 'min', '');
    this.args.updateFilter(component.type, 'max', '');
  }

  @action
  resetAllFilters() {

  }
}
