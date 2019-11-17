import Component from '@ember/component';
import { computed, action } from '@ember/object';
import { inject } from '@ember/service';
import config from '../config/environment';
import ajax from 'ember-ajax';

export default
class ThumbnailImage extends Component {
  isModalOpen = false;
  images = [];

  @inject
  store

  @computed('record')
  get url() {
    return config.image_server + this.record.thumbnail;
  }

  @computed('config.image_server')
  get imageServer() {
    return config.image_server;
  }

  @action
  toggleModal() {
    this.toggleProperty('isModalOpen');
    this.set('imagesLoading', true)

    const url = `${config.rails_host}/boats/${this.record.id}/images`;
    ajax(url, 'GET').then(response => {
      const images = response.data.attributes.images;
      this.set('images', images);
      this.set('imagesLoading', false);
    });
  }
}
