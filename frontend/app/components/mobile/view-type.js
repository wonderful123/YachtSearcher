import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default
class ViewTypeComponent extends Component {
  @service user;
  @tracked isMenuOpen = false;

  @action
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  @action
  closeMenu() {
    this.isMenuOpen = false;
  }

  @action
  setView(type) {
    type === 'gallery' ? this.user.setGalleryView(true) : this.user.setGalleryView(false);
    this.isMenuOpen = false;
  }
}
