import Component from '@ember/component';
import {
  computed,
  action
} from '@ember/object';
import config from '../config/environment';
import ajax from 'ember-ajax';

export default
class ListingImages extends Component {
  imagesLoading = true;
  images = [];
  MAX_THUMBNAILS = 8;
  showPreview = false;

  @computed
  get baseImageUrl() {
    return config.image_server;
  }

  @computed('images.[]')
  get thumbnails() {
    return this.images.slice(0, this.MAX_THUMBNAILS - 1);
  }

  @computed('images.[]')
  get lastImage() {
    return this.images[this.MAX_THUMBNAILS - 1];
  }

  @computed('images.[]')
  get remaingImagesCount() {
    return this.images.length - this.MAX_THUMBNAILS;
  }

  @computed('image.[]')
  get hasMoreImages() {
    return this.remaingImagesCount > 0;
  }

  didReceiveAttrs() {
    this._super(...arguments);
    const boatId = this.boat.id;
    const url = `${config.rails_host}/boats/${boatId}/images`;
    ajax(url, 'GET').then(response => {
      const images = response.data.attributes.images;
      this.set('selectedThumbnail', images[0]);
      this.set('images', images);
      this.set('imagesLoading', false);
    });
  }

  @action
  mouseEnter(imageUrl) {
    console.log('IMAGEURL', imageUrl)
    this.set('selectedThumbnail', imageUrl);

    // Calculate position of right side of listing images so preview can be shown on the right side of listing. And middle to justify.
    const element = this.$('.listing-images');
    this.set('thumbnailListPosition', {
      right: element.offset().left + element.width(),
      middle: element[0].getBoundingClientRect().top + element.height() / 2
    });
    this.set('showPreview', true);
  }

  @action
  hidePreview() {
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
}
