import Service from '@ember/service';
import { set } from '@ember/object';

export default
class Favourites extends Service {
  currentList = {
    name: 'Favourites',
    isActive: true,
    boats: [],
    note: ''
  };

  lists = []; // Multiple lists can be stored.

  get current() {
    return this.currentList.boats;
  }

  toggle(boat) {
    if (this.currentList.boats.includes(boat)) {
      this.currentList.boats.removeObject(boat);
    } else {
      this.currentList.boats.pushObject(boat);
    }
  }

  deleteCurrent() {
    set(this, 'currentList.boats', []);
    set(this, 'currentList.name', 'Favourites');
  }
}
