import Component from '@ember/component';

const columns = [
  { propertyName: 'thumbnail',
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
  }, {
    title: 'Options',
    component: 'optionsColumn'
  }
];

export default Component.extend({
  columns: columns,
  showComponentFooter: true,
  showColumnsDropdown: false,
  useFilteringByColumns: false,
  showGlobalFilter: true,
  useNumericPagination: false,
  doFilteringByHiddenColumns: false,
  multipleColumnsSorting: true,
  showPageSize: true,
  collapseNumPaginationForPagesCount: 1,
  showCurrentPageNumberSelect: true,
  filteringIgnoreCase: true,

  actions: {
    deleteRecord(record) {
      record.destroyRecord();
    },
  }
});
