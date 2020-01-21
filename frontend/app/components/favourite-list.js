import Component from '@glimmer/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default
class FavouriteList extends Component {
  @service
  favourites

  isModalOpen = false;

  @computed('favourites.boats.[]')
  get currentCount() {
    return this.favourites.count;
  }

  @action
  toggleModal() {
    this.toggleProperty('isModalOpen');
  }

  @action
  showFavourites() {
    this.favourites.list();
  }

  @action
  deleteCurrent() {
    this.favourites.deleteCurrent();
  }

  get hasFavourites() {
    return this.favourites.boats.length > 0 ? true : false;
  }
}
