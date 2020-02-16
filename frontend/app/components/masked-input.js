import Component from '@glimmer/component';
import { tracked } from "@glimmer/tracking";
import { action } from '@ember/object';

export default class MaskedInputComponent extends Component {
  @tracked value = this.args.value;

  get displayedValue() {
    return this.value.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  }

  set displayedValue(input) {
    this.value = input.replace(/[^0-9]/g,'');

  }

  // set value(input) {
  //   this.displayedValue = this.value.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  // }

  @action
  handleInput(event) {
    this.elem = event.target;
    this.cursor = event.target.selectionStart;
    if (this.cursor) this.elem.setSelectionRange(2, 5);
  }
}
