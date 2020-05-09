import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default
class HorizontalScrollerComponent extends Component {
  @tracked selectedBoat = null;

  @action setSelected(boat) {
    this.selectedBoat = boat;
  }
}
