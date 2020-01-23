import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from "@glimmer/tracking";
import config from '../config/environment';
import { inject as service } from '@ember/service';
import jQuery from 'jquery'

export default
class ListingImages extends Component {
  @service ajax;

  @tracked images = [];
  @tracked selectedThumbnail;

  imagesLoading = true;
  showPreview = false;
  MAX_THUMBNAILS = 8;
  ZOOM_LEVEL = 1.5;

  get baseImageUrl() {
    return config.image_server;
  }

  get thumbnails() {
    return this.images.slice(0, this.MAX_THUMBNAILS - 1);
  }

  get lastImage() {
    return this.images[this.MAX_THUMBNAILS - 1];
  }

  get remaingImagesCount() {
    return this.images.length - this.MAX_THUMBNAILS;
  }

  get hasMoreImages() {
    return this.remaingImagesCount > 0;
  }

  get selectedImageAttributes() {
    return null;
  }

  didReceiveAttrs() {
    const boatId = this.boat.id;
    const url = `${config.rails_host}/boats/${boatId}/images`;
    jQuery.ajax(url, 'GET').then(response => {
      const images = response.data.attributes.images;
      this.set('selectedThumbnail', images[0]);
      this.set('images', images);
      this.set('imagesLoading', false);
    });
  }

  @action
  handleMouseMove(offset, position) {
    this.set('offset', offset);

    // Move the main image in viewport
    this.positionMainImage(position);

    // this.moveZoomOverlay();
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
  handleMouseEnter(imageUrl) {
    this.set('selectedThumbnail', imageUrl);

    // Calculate position of right side of listing images so preview can be shown on the right.
    const elementRect = this.element.querySelector('.listing-images').getBoundingClientRect();
    this.set('thumbnailListContainer', {
      right: elementRect.right,
      middle: elementRect.top + elementRect.height / 2
    });

    this.set('showPreview', true);
  }

  @action
  handleMouseLeave() {
    this.set('showPreview', false);
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

  positionMainImage(position) {
    const mainImageElement = this.element.getElementsByClassName('main-image')[0];
    mainImageElement.style.objectPosition = `${position.x}% ${position.y}%`;
  }
}
