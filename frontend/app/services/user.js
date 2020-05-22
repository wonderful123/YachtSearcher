import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class UserService extends Service {
  @tracked galleryView = false; // Setting for view type (list or gallery)

  setGalleryView(isGallery) {
    this.galleryView = isGallery;
  }
}
