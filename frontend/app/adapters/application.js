import DS from 'ember-data';
import config from '../config/environment';

export default
class extends DS.JSONAPIAdapter {
  host = config.rails_host;
}
