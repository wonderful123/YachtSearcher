import Component from '@ember/component';
import { set } from '@ember/object';

const CATEGORIES = [
  {
    title: "Price",
    property: "price"
  }, {
    title: "Year",
    property: "year",
  }, {
    title: "Length",
    property: "length-inches",
  }, {
    title: "Date Listed",
    property: "first-found"
  }
];

export default Component.extend({
  init() {
    this._super(...arguments);

    // initialize sort properties for each column
    const sortProperties = {
      isSelected: false,
      sortDirection: 'desc',
      sortIcon: 'caret-down'
    };

    // Add sort properties to each category
    const categoryList = CATEGORIES;
    categoryList.forEach(c => Object.assign(c, sortProperties));

    // Set selected if in url param
    if (this.urlSortParam) {
      const urlProperty = this.urlSortParam.split('_')[0];
      const urlDirection = this.urlSortParam.split('_')[1];
      categoryList.forEach(c => {
        if (c.property === urlProperty) {
          c.isSelected = true;
          c.sortDirection = urlDirection;
          c.sortIcon = (urlDirection === 'desc') ? 'caret-down' : 'caret-up';
        }
      });
    }

    this.set('categories', categoryList)
  },

  actions: {
    handleSelection(selection) {
      this.categories.forEach(c => {
        if (c === selection) {
          // If selection is already selected then toggle icon and direction
          if (selection.isSelected) {
            if (c.sortDirection === 'desc') {
              set(c, 'sortDirection', 'asc');
              set(c, 'sortIcon', 'caret-up');
            } else {
              set(c, 'sortDirection', 'desc');
              set(c, 'sortIcon', 'caret-down');
            }
          }
          set(c, 'isSelected', true);
        } else {
          set(c, 'isSelected', false);
        }
      });

      // Call parent action
      this.doSort(selection.property, selection.sortDirection);
    }
  }
});
