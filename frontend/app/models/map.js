import Model, { attr } from '@ember-data/model';

export default class MapModel extends Model {
  @attr title;
  @attr('number') price;
  @attr priceSymbol;
  @attr priceFormatted;
  @attr('number') lengthInches;
  @attr state;
  @attr city;
  @attr('number') year;
  @attr make;
  @attr model;
  @attr('image-url') thumbnail;
  @attr('number') latitude;
  @attr('number') longitude;
  @attr location;
  @attr isGeocoded;
}
