import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class LengthDialogComponent extends Component {
  get startMin() {
    return this.args.filterComponent.min || this.args.filterComponent.rangeMin;
  }

  get startMax() {
    return this.args.filterComponent.max || this.args.filterComponent.rangeMax;
  }

  rangeFormatter(value) {
    return value.toFixed(0) + 'ft';
  }

  @action
  onRangeChange(values) {
    const min = (values[0] === this.args.filterComponent.rangeMin) ? '' : values[0].toFixed(0);
    const max = (values[1] === this.args.filterComponent.rangeMax) ? '' : values[1].toFixed(0);

    const type = this.args.filterComponent.type;
    this.args.updateFilter(type, 'min', min);
    this.args.updateFilter(type, 'max', max);
  }
}
