import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from "@glimmer/tracking";

export default class RangeFilterButton extends Component {
  @tracked isShown = false;

  @action
  toggleModal() {
    this.isShown = !this.isShown;
  }
}
