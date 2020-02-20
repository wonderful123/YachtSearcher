import Component from '@glimmer/component';

// If per page needed:
// <div class="per-page">
//   <select>
//     <option selected>Choose...</option>
//     <option value="1">One</option>
//     <option value="2">Two</option>
//     <option value="3">Three</option>
//   </select>
//   Per page: {{@meta.items}}
// </div>

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
          text: `${page}`,
          url: scaffoldUrl.replace('__pagy_page__', page),
          isCurrent: true
        });
      }
    });

    return series;
  }

  get previous() {
    return {
      url: this.args.meta.prev_url,
      isDisabled: this.args.meta.first_url === this.args.meta.page_url
    }
  }

  get next() {
    return {
      url: this.args.meta.next_url,
      isDisabled: this.args.meta.last_url === this.args.meta.page_url
    }
  }
}
