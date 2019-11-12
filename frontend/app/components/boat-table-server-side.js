import ModelsTableServerPaginated from './models-table-server-paginated';
import {
  computed
} from '@ember/object';

export default
class BoatTableServerSide extends ModelsTableServerPaginated {

  doQuery(store, modelName, query) {
    console.log('STORE, MODELNAME, QUERY', store, modelName, query)
    super.doQuery(...arguments);
  };
  constructor() {
    super(...arguments);
    console.log(this)
  }


  filterQueryParameters = {
    page: 'page',
    pageSize: 'per_page',
    globalFilter: 'search',
    sort: 'sorted_by',
    sortDirection: 'sort_dir',
  };
  showComponentFooter = true;
  showColumnsDropdown = false;
  useFilteringByColumns = false;
  showGlobalFilter = true;
  useNumericPagination = true;
  doFilteringByHiddenColumns = false;
  multipleColumnsSorting = false;
  showPageSize = true;
  collapseNumPaginationForPagesCount = 10;
  showCurrentPageNumberSelect = false;
  filteringIgnoreCase = true;
  metaItemsCountProperty = 'count';
  metaPagesCountProperty = 'pages';

  columns = [{
    propertyName: 'thumbnail',
    title: 'Thumbnail',
    component: 'thumbnail-image'
  }, {
    propertyName: 'year',
    title: 'Year',
  }, {
    propertyName: 'price',
    title: 'Price',
    component: 'price-text'
  }, {
    propertyName: 'title',
    title: 'Title'
  }, {
    propertyName: 'length-inches',
    title: 'Length',
    component: 'inches-to-feet'
  }];
};
