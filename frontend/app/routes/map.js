import Route from '@ember/routing/route';

export default class MapRoute extends Route {
  model() {
    return this.get('store').findAll('boat');
  }
}
