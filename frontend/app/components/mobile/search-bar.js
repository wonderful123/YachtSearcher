import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default
class SearchBarComponent extends Component {
  @tracked isCustomMenuOpen = false;

  @action
  updateSearchFilter(type, event) {
    if (type === 'search') this.args.updateFilter('search', 'value', event.target.value);
  }
}
