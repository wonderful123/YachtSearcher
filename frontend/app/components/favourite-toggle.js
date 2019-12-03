import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { inject } from '@ember/service';

export default
class FavouriteIcon extends Component {
  @inject
  favourites

  @computed('favourites.boats.[]')
  get isActive() {
    return this.favourites.includes(this.boat) ? 'active' : 'not-active';
  }

  @action
  toggleFavourite() {
    this.favourites.toggle(this.boat)
  }
}
