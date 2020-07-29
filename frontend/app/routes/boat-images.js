import Route from '@ember/routing/route';

export default class BoatImagesRoute extends Route {
  model() {
    return this.store.findAll('boat');
  }
}
