// Returns number as thousand k seperated by commas
// eg. 2933451 = 2,933k
export function thousands(value) {
  return (value / 1000).toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + 'k';
}

// Adds suffix or prefix to string.
// Eg. (1,234, {prefix: '$'})
export function addAffix(s, affix) {
  return `${affix.prefix || ''}${s}${affix.suffix || ''}`;
}
