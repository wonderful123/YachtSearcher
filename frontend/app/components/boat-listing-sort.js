import Component from '@glimmer/component';
import { set, action } from '@ember/object';

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

export default
class BoatListingSort extends Component {
  constructor() {
    super(...arguments);

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

    set(this, 'categories', categoryList);
  }

  @action
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
    this.args.doSort(selection.property, selection.sortDirection);
  }
}
