import Component from '@glimmer/component';

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
      formatFunction: this.args.rangeFormatter,
    }, {
      to: this.formatter,
      min: this.min,
      max: this.max,
      formatFunction: this.args.rangeFormatter,
  }];

  formatter(value) {
    if (value === this.max) {
      return 'No max';
    } else if (value === this.min) {
      return 'No min';
    } else {
      return this.formatFunction(value);
    }
  }
}
