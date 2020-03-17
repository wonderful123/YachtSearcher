import Component from '@glimmer/component';
import { action } from '@ember/object';
import { thousands } from 'frontend/utils/formatting';

export default class FilterBarPriceModalComponent extends Component {
  get startMin() {
    return this.args.filterComponent.min || this.args.filterComponent.rangeMin;
  }

  get startMax() {
    return this.args.filterComponent.max || this.args.filterComponent.rangeMax;
  }

  rangeFormatter(value) {
    return '$' + thousands(value);
  }

  @action
  onRangeChange(values) {
    // Nearest thousand
    const min = (values[0] === this.args.filterComponent.rangeMin) ? '' : Math.round(values[0] / 1000) * 1000;
    const max = (values[1] === this.args.filterComponent.rangeMax) ? '' : Math.round(values[1] / 1000) * 1000;

    const type = this.args.filterComponent.type;
    this.args.updateFilter(type, 'min', min);
    this.args.updateFilter(type, 'max', max);
  }
}
