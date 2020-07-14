import Route from '@ember/routing/route';

export default class MobileListingRoute extends Route {
  model(params) {
   return this.store.findRecord('boat', params.boat_id);
  }
}
