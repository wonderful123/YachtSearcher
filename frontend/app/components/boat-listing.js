import Component from '@ember/component';
import { computed } from '@ember/object';

export default
class BoatListing extends Component {
  @computed('boat.firstFound')
  get firstFound() {
    const m = new Date(this.boat.firstFound);
    return m.getUTCDate() + "/" + + m.getUTCMonth()  + "/" + m.getUTCFullYear();
  }
}
