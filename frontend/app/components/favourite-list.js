import Component from '@ember/component';
import { action } from '@ember/object';
import { inject } from '@ember/service';

export default
class FavouriteList extends Component {
  @inject
  favourites

  @action
  showFavourites() {
    this.favourites.list();
  }

  @action
  deleteCurrent() {
    this.favourites.deleteCurrent();
  }

  get hasFavourites() {
    return this.favourites.currentList.boats.length > 0 ? true : false;
  }
}
