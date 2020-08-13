import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default
class SortComponent extends Component {
  options = [
    { icon: 'date', label: 'Date listed', property: 'first-found' },
    { icon: 'price', label: 'Price', property: 'price' },
    { icon: 'length', label: 'Length', property: 'length-inches' },
    { icon: 'year', label: 'Year', property: 'year' }
  ];

  @tracked selected = this.options[0]; // Defaults if sortby argument not set
  @tracked direction = 'desc';

  @tracked isOpen = false;

  constructor() {
    super(...arguments);

    // Init sort if set
    if (this.args.sortby) {
      // Split sortby parameter into direction and property then find that property in options
      this.selected = this.options[this.options.map(e => e.property).indexOf(this.args.sortby.split('_')[0])];
      this.direction = this.args.sortby.split('_')[1];
    }
  }

  @action
  toggleOpen() {
    this.isOpen = !this.isOpen;
  }

  @action
  setDirection(direction) {
    this.direction = direction;
  }

  @action
  done() {
    this.isOpen = false;
    this.args.doSort(this.selected.property, this.direction);
  }

  @action
  select(option) {
    this.selected = option;
  }
}
