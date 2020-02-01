import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from "@glimmer/tracking";

export default
class ListingImages extends Component {
  MAX_THUMBNAILS = 8;
  ZOOM_LEVEL = 1.5;

  @tracked images = this.args.boat.images;
  @tracked selectedThumbnail = this.images[0];
  @tracked showPreview = false;

  @tracked mouseThumbnailPosition;

  // Only show max thumbnails
  @tracked thumbnails = this.images.slice(0, this.MAX_THUMBNAILS - 1);

  get lastImage() {
    return this.images[this.MAX_THUMBNAILS - 1];
  }

  get remainingImagesCount() {
    return this.args.boat.totalImages - this.MAX_THUMBNAILS;
  }

  get hasMoreImages() {
    return this.remainingImagesCount > 0;
  }

  @action
  handleMouseEnter(imageUrl) {
    if (this.selecedThumbnail != imageUrl) this.selectedThumbnail = imageUrl;
    this.showPreview = true;
  }

  @action
  handleMouseLeave() {
    this.showPreview = false;
  }

  @action
  updateMouseOffset(offset) {
    this.mouseThumbnailPosition = offset;
  }
}
