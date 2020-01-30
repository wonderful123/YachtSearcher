import Model, { attr } from '@ember-data/model';

export default class HistoryModel extends Model {
  @attr('number') price;
  @attr('number') changeDate;
  @attr boat;
}
