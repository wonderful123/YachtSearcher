import {
  helper
} from '@ember/component/helper';

function titlecase(str) {
  if (str[0]) {
    return str[0].replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }
}
export default helper(titlecase);
