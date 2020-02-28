import {
  helper
} from '@ember/component/helper';

export function formatCurrency(params) {
  if (params) {
    let [price, symbol] = params;
    symbol = symbol.replace('US', ''); // Assume USD is default but should A$, etc.
    return symbol + parseFloat(price).toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  } else {
    return '';
  }
}

export default helper(formatCurrency);
