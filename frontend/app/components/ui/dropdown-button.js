import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default
class DropdownButton extends Component {
  @tracked isSelected = false;

  get iconDirection() {
    return this.isSelected ? 'chevron-up' : 'chevron-down';
  }

  @action
  onClick() {
    this.isSelected = !this.isSelected;

    this.args.onClick();
  }
}
