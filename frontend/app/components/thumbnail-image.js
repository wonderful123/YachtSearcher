import Component from '@ember/component';
import { computed } from '@ember/object';
import config from '../config/environment';

export default Component.extend({
  url: computed('record', function() {
    return config.image_server + this.record.thumbnail;
  })
});
