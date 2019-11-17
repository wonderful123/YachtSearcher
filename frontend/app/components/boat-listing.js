import Component from '@ember/component';
import { computed } from '@ember/object';

export default
class BoatListing extends Component {
  @computed('boat.firstFound')
  get firstFound() {
    return new Date(this.boat.firstFound).toDateString();
  }
}
