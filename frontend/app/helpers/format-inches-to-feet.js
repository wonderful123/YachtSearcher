import { helper } from '@ember/component/helper';

export function formatInchesToFeet(totalInches) {
  const feet = Math.floor(totalInches/12);
  const inches = totalInches % 12;
  const inchText = (inches === 0) ? `` : ` ${inches}"`;
  return `${feet}'${inchText}`;
}

export default helper(formatInchesToFeet);
