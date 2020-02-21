import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from "@glimmer/tracking";
import { inject as service } from '@ember/service';

export default
class FavouriteList extends Component {
  @service favourites

  @tracked isModalOpen = false;

  get currentCount() {
    return this.favourites.count;
  }

  @action
  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
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
