import Component from '@glimmer/component';
import { action } from '@ember/object';

const RANGE_SHRINK = 0.9; // Percentage of smaller boundary

export default
class PanningThumbnail extends Component {
  @action
  handleMouseMove(mouse) {
    // Shrink the movement range down so mouse doesn't need to be in the extremes to move the whole image

    // Calculate the % offset of mouse position in thumbnail
    const offsetX = mouse.offsetX / (this.containerElement.clientWidth) * 100;
    const offsetY = mouse.offsetY / (this.containerElement.clientHeight) * 100;

    // inner box reduced by equal pixels for top and sides. Just use the smallest.
    const rangeX = (this.containerElement.clientWidth / RANGE_SHRINK) - this.containerElement.clientWidth;
    const rangeY = (this.containerElement.clientHeight / RANGE_SHRINK) - this.containerElement.clientHeight;
    const rangeShrink = rangeX >= rangeY ? rangeX : rangeY;

    const innerRatioX = (this.containerElement.clientWidth - rangeShrink * 2) / this.containerElement.clientWidth;
    const innerRatioY = (this.containerElement.clientHeight - rangeShrink * 2) / this.containerElement.clientHeight

    // Offset is between 0 and 100. Make it -50 to +50, apply shrink then return to normal.
    let x = (offsetX - 50) / innerRatioX + 50;
    let y = (offsetY - 50) / innerRatioY + 50;

    // Bounding box
    if (x < 0) x = 0;
    if (x > 100) x = 100;
    if (y < 0) y = 0;
    if (y > 100) y = 100;

    // Move the image
    this.imageElement.style.objectPosition = `${x}% ${y}%`;

    // Share mouse with parent
    this.args.updateMouseOffset({offsetX, offsetY});
  }

  // function calculateZoomViewport(mouse, thumb) {
  //   let t = thumb.position();
  //   t.width = thumb.width();
  //   t.height = thumb.height();
  //
  //   let z = {}; // Zoom overlay
  //   z.width = t.width / ZOOM_LEVEL;
  //   z.height = t.height / ZOOM_LEVEL;
  //   z.top = mouse.y - z.height / 2;
  //   z.left = mouse.x - z.width / 2;
  //
  //   // Bounce off boundary
  //   if (z.top < t.top) z.top = t.top;
  //   if (z.left < t.left) z.left = t.left;
  //   if (z.top + z.height > t.top + t.height) z.top = t.top + t.height - z.height;
  //   if (z.left + z.width > t.left + t.width) z.left = t.left + t.width - z.width;
  //
  //   z.offsetX = (z.left - t.left) / z.width * 100;
  //   z.offsetY = (z.top - t.top) / z.height * 100;
  //
  //   return z;
  // }
}
