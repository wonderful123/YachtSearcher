import {
  helper
} from '@ember/component/helper';

export function formatCurrencyUnits([price, symbol]) {
  if (symbol) symbol = symbol.replace('US', ''); // Assume USD is default but should A$, etc.
  let units = '';

  if (price) {
    price = parseFloat(price).toFixed(0);

    // Shrink number to 150k, etc.
    if (price > 1000) {
      price = price / 1000;
      units = 'k';
    }

    // Add commas
    price = price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  }

  return symbol + price + units;
}

export default helper(formatCurrencyUnits);
