import Controller from '@ember/controller';
import { action, get, set } from '@ember/object';

export default
class BoatsController extends Controller {
  queryParams = ['page', 'per_page', 'search', 'sortby', 'length', 'price', 'year'];
  page = 1;
  per_page = 10;
  search = '';
  sortby = '';
  year = '';
  price = '';
  length = '';

  @action
  displayChangeAction(d) {
    this.setProperties({
      page: get(d, 'currentPageNumber'),
      per_page: get(d, 'pageSize'),
    });
    console.log('D', d)
  }

  @action
  updateFilters(values) {
    set(this, 'year', values.year);
    set(this, 'price', values.price);
    set(this, 'length', values.length);
    set(this, 'page', 1); // Return to first page
  }
}
