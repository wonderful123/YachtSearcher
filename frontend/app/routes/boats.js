import Route from '@ember/routing/route';

export default
class extends Route {
  queryParams = {
    per_page: { refreshModel: true },
    page: { refreshModel: true },
    search: { refreshModel: true },
    sortby: { refreshModel: true },
    length: { refreshModel: true },
    price: { refreshModel: true },
    year: { refreshModel: true },
  }

  model(params) {
    return this.store.query('boat', params);
  }
}
