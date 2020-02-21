import Component from '@glimmer/component';

export default
class BoatListing extends Component {
  get firstFound() {
    const d = new Date(this.args.boat.firstFound);
    return d.getUTCDate() + "/" + d.getUTCMonth()  + "/" + d.getUTCFullYear();
  }

  get date() {
    const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG',
                    'SEP', 'OCT', 'NOV', 'DEC'];
    const d = new Date(this.args.boat.firstFound);
    return {
      day: d.getUTCDate(),
      month: MONTHS[d.getUTCMonth()]
    };
  }
}
