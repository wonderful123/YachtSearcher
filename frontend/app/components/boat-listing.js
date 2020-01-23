import Component from '@glimmer/component';

export default
class BoatListing extends Component {
  get firstFound() {
    const m = new Date(this.args.boat.firstFound);
    return m.getUTCDate() + "/" + + m.getUTCMonth()  + "/" + m.getUTCFullYear();
  }
}
