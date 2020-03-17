import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class RangeSliderComponent extends Component {
  min = this.args.rangeMin;
  max = this.args.rangeMax;

  get start() {
    return [this.args.startMin, this.args.startMax];
  }

  tooltips = [{
    to: this.formatter,
    min: this.min,
    max: this.max,
    formatFunction: this.formatter,
  }, {
    to: this.formatter,
    min: this.min,
    max: this.max,
    formatFunction: this.formatter,
  }];

  @action
  formatter(value) {
    if (value === this.max) {
      return 'No max';
    } else if (value === this.min) {
      return 'No min';
    } else {
      return this.args.rangeFormatter(value);
    }
  }
}
