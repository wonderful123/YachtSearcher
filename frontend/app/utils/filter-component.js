import { tracked } from '@glimmer/tracking';
import { addAffix } from 'frontend/utils/formatting';

export default class FilterComponent {
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

  // Range title string
  get minMaxLabel() {
    // Add formatter function and affix
    const format = (value) => {
      if (value) {
        if (this.formatter) {
          return addAffix(this.formatter(value), this);
        } else {
          return addAffix(value, this);
        }
      }
      return value;
    }

    let min = format(this.min);
    let max = format(this.max);

    if (!min && !max) {
      // Title case the 'type' property
      return `${this.type.replace(/^\w/, c => c.toUpperCase())}`;
    } else if (min && max) {
      return `${min} - ${max}`;
    } else if (min) {
      return `> ${min}`;
    } else {
      return `< ${max}`;
    }
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
