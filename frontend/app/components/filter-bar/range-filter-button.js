import Component from '@glimmer/component';
import { addAffix } from 'frontend/utils/formatting';

export default class RangeFilterButton extends Component {
  get minMaxLabel() {
    const f = this.args.filterComponent;

    // Add formatter function and affix
    const format = (value) => {
      if (value) {
        if (f.formatter) {
          return addAffix(f.formatter(value), f);
        } else {
          return addAffix(value, f);
        }
      }
      return value;
    }

    let min = format(f.min);
    let max = format(f.max);

    if (!min && !max) {
      // Title case the 'type' property
      return `Any ${f.type.replace(/^\w/, c => c.toUpperCase())}`;
    } else if (min && max) {
      return `${min} - ${max}`;
    } else if (min) {
      return `> ${min}`;
    } else {
      return `< ${max}`;
    }
  }
}
