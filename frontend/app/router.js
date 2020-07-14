import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  this.route('boats');
  this.route('boat-listings');
  this.route('boat-images');
  this.route('mobile');
  this.route('mobile-listing', { path: '/mobile-listing/:boat_id' });
  this.route('map');
});
