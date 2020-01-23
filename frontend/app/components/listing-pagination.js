import Component from '@glimmer/component';

export default
class ListingPagination extends Component {
  get series() {
    const seriesData = this.args.meta.series;
    const scaffoldUrl = this.args.meta.scaffold_url;
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
