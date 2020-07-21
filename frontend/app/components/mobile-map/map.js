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

  get geocodedBoats() {
    return this.args.boats.filter(b => b.isGeocoded === true);
  }

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
    let div = divIcon();
    div.options.iconSize = [50,50]
    div.options.html =
      `<div class="marker-cluster-small">
         <div class="number-of-boats">
           ${markers.length}
           <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
             <polygon points="74.787,375.394 257.554,375.394 257.554,0 		"/>
             <polygon points="289.053,77.246 289.053,375.394 434.211,375.394 		"/>
             <path d="M8.511,406.892c19.964,30.876,47.161,56.669,79.154,74.915C122.297,501.56,161.675,512,201.544,512h186.552
           			c24.499,0,47.826-7.744,67.462-22.394s33.701-34.808,40.677-58.292l7.254-24.422H8.511z"/>
           </svg>
         </div>
         <div class="avg-price">
           $${formattedCurrency}k
         </div>
       </div>`
    div.options.className = 'marker-cluster-small'
    return div
		// return divIcon({
    //   html: `<div class="marker-cluster-small">
    //            <div class="number-of-boats">
    //              ${markers.length}
    //            </div>
    //            <div class="avg-price">
    //              $${formattedCurrency}k
    //            </div>
    //          </div>`,
    //   className: 'marker-cluster-small',
    //   iconSize: [50, 50] });
	};
}
