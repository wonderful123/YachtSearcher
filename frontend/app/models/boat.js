import Model, { attr } from '@ember-data/model';

export default class BoatModel extends Model {
  @attr title;
  @attr('number') price;
  @attr priceSymbol;
  @attr priceFormatted;
  @attr description;
  @attr('') firstFound;
  @attr listingId;
  @attr('number') lengthInches;
  @attr country;
  @attr state;
  @attr city;
  @attr('number') year;
  @attr make;
  @attr model;
  @attr('number') cabins;
  @attr thumbnail;
  @attr('number') latitude;
  @attr('number') longitude;
  @attr location;
  @attr('image-url') images;
  @attr histories;
  @attr listings;
}
