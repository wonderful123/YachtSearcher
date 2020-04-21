import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { thousands } from 'frontend/utils/formatting';
import FilterComponent from 'frontend/utils/filter-component';

const RANGE_FILTERS = [{
    type: 'price',
    prefix: '$',
    range: { min: 0, max: 500000 },
    component: 'mobile/dialog/price',
    title: 'Price range',
    formatter: thousands
  }, {
    type: 'length',
    range: { min: 0, max: 70 },
    suffix: 'ft',
    component: 'mobile/dialog/length',
    title: 'Length range'
  }, {
    type: 'year',
    range: { min: 1940, max: parseInt(new Date().getFullYear()) + 2 },
    component: 'mobile/dialog/year',
    title: 'Year range',
  }];

export default class FilterMenuComponent extends Component {
  @tracked filterComponents;
  @tracked isDialogOpen = false;
  @tracked activeFilter = null;

  constructor() {
    super(...arguments);
    this.filterComponents = RANGE_FILTERS.map(c => new FilterComponent(c, this.args.filter));
  }

  @action
  resetFilter(filter) {
    this.args.updateFilter(filter.type, 'min', '');
    this.args.updateFilter(filter.type, 'max', '');
  }

  @action
  resetAll() {
    this.filterComponents.forEach(filter => {
      this.args.updateFilter(filter.type, 'min', '');
      this.args.updateFilter(filter.type, 'max', '');
    });
  }
}
