import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from "@glimmer/tracking";

export default
class CollapsableSidebar extends Component {
  @tracked isActive = true;

  @action
  toggleCollapse() {
    this.isActive = !this.isActive;
  }
}
