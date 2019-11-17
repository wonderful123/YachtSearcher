import Component from '@ember/component';
import { action, set } from '@ember/object';
import { inject } from '@ember/service';

export default
class FavouriteIcon extends Component {
  @inject
  favourites

  isActive = 'not-active';

  @action
  toggleFavourite() {
    const state = (this.isActive === 'not-active') ? 'active' : 'not-active';
    set(this, 'isActive', state);
    this.favourites.toggle(this.boat)
  }
}
