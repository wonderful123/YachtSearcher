import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { inject } from '@ember/service';

export default
class Favourites extends Service {
  @inject flashMessages

  @tracked boats = [];
  @tracked name = 'Favourites';
  @tracked note = '';

  @tracked lists = []; // Multiple lists can be stored.

  get current() {
    return this.boats;
  }

  get count() {
    return this.boats.length;
  }

  toggle(boat) {
    if (this.boats.includes(boat)) {
      this.boats.removeObject(boat);
      this.flashMessages.add({ message: 'Removed from favourites', type: 'info' });
    } else {
      this.flashMessages.add({ message: 'Added to favourites', type: 'success' });
      this.boats.pushObject(boat);
    }
  }

  deleteCurrent() {
    this.boats = [];
    this.name = 'Favourites';
  }

  // is boat in current list?
  includes(boat) {
    return this.boats.includes(boat);
  }
}
