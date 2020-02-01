import Component from '@glimmer/component';
import { action, set } from '@ember/object';
import { tracked } from "@glimmer/tracking";

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

// Class to hold tracked sort properties
class SortProperty {
  constructor({ title, property }) {
    this.title = title;
    this.property = property;
  }

  @tracked isSelected = false;
  @tracked sortDirection = 'desc';
  @tracked sortIcon = 'caret-down';
}

export default
class BoatListingSort extends Component {
  @tracked categories;

  constructor() {
    super(...arguments);

    // Add sort properties to each category
    let categoryList = CATEGORIES.map(c => new SortProperty(c));

    // Set selected if in url param
    if (this.args.urlSortParam) {
      const urlProperty = this.args.urlSortParam.split('_')[0];
      const urlDirection = this.args.urlSortParam.split('_')[1];
      
      categoryList.forEach(c => {
        if (c.property === urlProperty) {
          c.isSelected = true;
          set(c, 'sortDirection', urlDirection);
          set(c, 'sortIcon', (urlDirection === 'desc') ? 'caret-down' : 'caret-up');
        }
      });
    }

    this.categories = categoryList;
  }

  @action
  handleSelection(selection) {
    this.categories.forEach(c => {
      if (c === selection) {
        // If selection is already selected then toggle icon and direction
        if (selection.isSelected) {
          if (c.sortDirection === 'desc') {
            c.sortDirection = 'asc';
            c.sortIcon = 'caret-up';
          } else {
            c.sortDirection = 'desc';
            c.sortIcon = 'caret-down';
          }
        }
        c.isSelected = true;
      } else {
        c.isSelected = false;
      }
    });

    // Call parent action
    this.args.doSort(selection.property, selection.sortDirection);
  }
}
