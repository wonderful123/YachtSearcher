import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from "@glimmer/tracking";

class ThumbnailListingContainer {
  @tracked right = 0;
  @tracked middle = 0;
}

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
  @tracked thumbnailListingContainer = new ThumbnailListingContainer();

  @action
  setListingContainer(containerElement) {
    // Calculate position of right side of listing images so preview can be shown on the right.
    const elementBoundingRect = containerElement.getBoundingClientRect();

    this.thumbnailListingContainer.right = elementBoundingRect.right;
    this.thumbnailListingContainer.middle = elementBoundingRect.top + elementBoundingRect.height / 2
  }

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






  @action
  moveZoomOverlay(element, left, top) {
    element.style.top = top;
    element.style.left = left;

    //  $('.zoom-overlay').css({
    //   top: top,
    //   left: left
    // });
  }

  @action
  handleZoom(event) {
    // Percentage of position of mouse in thumbnail
    this.set('mouseEvent', event);
    this.set('offsetX', event.offsetX / this.thumbnailWidth * 100);
    this.set('offsetY', event.offsetY / this.thumbnailHeight * 100);

    // this.$('.zoom-overlay').css({top: event.clientY - Math.ceil(this.thumbnailHeight / 4), left: event.clientX - Math.ceil(this.thumbnailWidth / 4)});
    // console.log('EVENT.CLIENTX - MATH.CEIL(THIS.THUMBNAILWIDTH / 4)', event.clientX - Math.ceil(this.thumbnailWidth / 4))
  }
}
