import Service from '@ember/service';
import { set, computed } from '@ember/object';

export default
class Favourites extends Service {
  boats = [];
  name = 'Favourites';
  note = '';

  lists = []; // Multiple lists can be stored.

  @computed('boats.[]')
  get current() {
    return this.boats;
  }

  @computed('boats.[]')
  get count() {
    return this.boats.length;
  }

  toggle(boat) {
    if (this.boats.includes(boat)) {
      this.boats.removeObject(boat);
    } else {
      this.boats.pushObject(boat);
    }
  }

  deleteCurrent() {
    set(this, 'boats', []);
    set(this, 'name', 'Favourites');
  }

  // is boat in current list?
  includes(boat) {
    return this.boats.includes(boat);
  }
}
