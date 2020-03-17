import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default
class DropdownButton extends Component {
  @tracked _isSelected = false;

  get isSelected() {
    if (this.args.isSelected != undefined) {
      return (this._isSelected = this.args.isSelected);
    }

    return this._isSelected;
  }

  get iconDirection() {
    return this._isSelected ? 'chevron-up' : 'chevron-down';
  }

  @action
  onClick() {
    this.args.onClick();

    if (this.args.isSelected != undefined) {
      this._isSelected = this.args.isSelected;
    } else {
      this._isSelected = !this._isSelected;
    }
  }
}
