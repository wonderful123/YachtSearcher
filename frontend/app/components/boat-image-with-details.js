import Component from '@ember/component';
import config from '../config/environment';
import {
  computed
} from '@ember/object';

export default Component.extend({
  thumbnail: computed('boat.thumbnail', function() {
    return config.image_server + this.boat.thumbnail;
  })
});
