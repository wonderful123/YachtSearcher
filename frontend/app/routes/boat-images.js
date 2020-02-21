import Route from '@ember/routing/route';

export default class BoatImagesRoute extends Route {
  model() {
    return this.get('store').findAll('boat');
  }
}
