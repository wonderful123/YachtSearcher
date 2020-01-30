import Model, { attr } from '@ember-data/model';

export default class SiteModel extends Model {
  @attr name;
  @attr url;
  @attr('date') lastUpdate;
  @attr boats;
}
