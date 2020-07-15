import Component from '@glimmer/component';
import { divIcon } from 'ember-leaflet/helpers/div-icon';
import { point } from 'ember-leaflet/helpers/point';

export default
class MobileMap extends Component {
  lat = -25.2743988;
  lng = 133.7751312;
  zoom = 4;
  tileUrl = "http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg"; // Pastel tile
  tileUrl2 = "https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.png"; // Label overlay

  iconCreateFunction = function(cluster) {
    let markers = cluster.getAllChildMarkers();
    let total = 0;
    markers.forEach(m => {
      total += m.options.title;
    });
    let averagePrice = total / markers.length;
    const kFormatter = (num) => Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num);
    let formattedCurrency = kFormatter(averagePrice).split('k')[0];
    formattedCurrency = parseInt(formattedCurrency);
    formattedCurrency = formattedCurrency.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
		return divIcon({
      html: `<div>
               <div class="number-of-boats">
                 ${markers.length}
               </div>
               <div class="avg-price">
                 $${formattedCurrency}k
               </div>
             </div>`,
      className: 'marker-cluster-small',
      iconSize: new point(50, 50) });
	};
}
