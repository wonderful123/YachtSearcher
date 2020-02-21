import Component from '@glimmer/component';
import config from '../config/environment';

export default
class BoatImageWithDetails extends Component {
  get thumbnail() {
    return config.image_server + this.boat.thumbnail;
  }
}
