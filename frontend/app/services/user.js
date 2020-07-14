import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class UserService extends Service {
  @service session;

  @tracked galleryView; // Setting for view type (list or gallery)

  constructor() {
    super(...arguments);
    // Initialize settings from session or default
    this.galleryView = this.session.get('data.galleryView') || false;
  }

  setGalleryView(isGallery) {
    this.galleryView = isGallery;
    this.session.set('data.galleryView', isGallery);
  }
}
