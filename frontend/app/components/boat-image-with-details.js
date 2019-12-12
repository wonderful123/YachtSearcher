import Component from '@ember/component';
import config from '../config/environment';
import {
  computed
} from '@ember/object';

export default
class BoatImageWithDetails extends Component {
  @computed('boat.thumbnail')
  get thumbnail() {
    return config.image_server + this.boat.thumbnail;
  }
}
