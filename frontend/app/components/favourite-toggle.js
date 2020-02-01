import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject } from '@ember/service';

export default
class FavouriteIcon extends Component {
  @inject favourites

  get isActive() {
    return this.favourites.includes(this.args.boat) ? 'active' : 'not-active';
  }

  @action
  toggleFavourite() {
    this.favourites.toggle(this.args.boat)
  }
}
