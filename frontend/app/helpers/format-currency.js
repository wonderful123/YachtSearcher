import { helper } from '@ember/component/helper';

export function formatCurrency(params) {
  let [price, symbol] = params;
  symbol = symbol.replace('US', ''); // Assume USD is default but should A$, etc.
  return symbol + price.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}

export default helper(formatCurrency);
