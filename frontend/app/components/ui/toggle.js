import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default
class ToggleButton extends Component {
  @tracked isToggled = false;

  @action
  toggle() {
    this.isToggled = !this.isToggled;
  }
}
