import {
  helper
} from '@ember/component/helper';

export function formatCurrency([price, symbol]) {
  if (symbol) symbol = symbol.replace('US', ''); // Assume USD is default but should A$, etc.

  if (price) {
    price = parseFloat(price)
            .toFixed(0)
            .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  }

  return symbol + price;
}

export default helper(formatCurrency);
