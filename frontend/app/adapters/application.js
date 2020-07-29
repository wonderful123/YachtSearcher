import JSONAPIAdapter from '@ember-data/adapter/json-api';
import config from '../config/environment';

export default
class extends JSONAPIAdapter {
  host = config.rails_host;
}
