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

  @tracked selected = this.options[0] || "";
  @tracked direction = 'desc';

  @tracked isOpen = false;

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
