import DS from 'ember-data';
const {
  Model,
  attr,
  hasMany
} = DS;

export default Model.extend({
  title: attr('string'),
  price: attr('number'),
  currency: attr('string'),
  firstFound: attr('date'),
  listingId: attr('string'),
  lengthInches: attr('number'),
  country: attr('string'),
  state: attr('string'),
  city: attr('string'),
  year: attr('number'),
  make: attr('string'),
  model: attr('string'),
  cabins: attr('number'),
  thumbnail: attr('string'),
  latitude: attr('number'),
  longitude: attr('number'),
  location: attr('string'),
  histories: hasMany('history'),
  listings: hasMany('listing')
});
