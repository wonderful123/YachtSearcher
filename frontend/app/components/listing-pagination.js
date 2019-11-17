import Component from '@ember/component';
import {
  computed
} from '@ember/object';

export default
class ListingPagination extends Component {
  @computed('meta')
  get series() {
    const seriesData = this.meta.series;
    const scaffoldUrl = this.meta.scaffold_url;
    let series = [];

    seriesData.forEach(page => {
      if (typeof(page) === "number") {
        series.pushObject({
          text: page,
          url: scaffoldUrl.replace('__pagy_page__', page)
        });
      } else if (page === "gap") {
        series.pushObject({
          text: '...',
          url: false
        });
      } else {
        series.pushObject({
          text: `[${page}]`,
          url: scaffoldUrl.replace('__pagy_page__', page)
        });
      }
    });

    return series;
  }
}
