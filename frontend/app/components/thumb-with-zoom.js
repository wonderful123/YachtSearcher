import Component from '@glimmer/component';
import { action } from '@ember/object';

const RANGE_SHRINK = 2.5;

export default
class ThumbWithZoom extends Component {
  get imgElement() {
    return this.element.getElementsByTagName('img')[0];
  }

  get imageDimensions() {
    const img = this.imgElement;
    return {
      width: img.width,
      height: img.height,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      aspect: img.naturalWidth / img.naturalHeight
    };
  }

  @action
  handleMouseMove(event) {
    // Percentage offset position of mouse over the image element
    const offset = {
      x: event.offsetX / this.imageDimensions.width * 100,
      y: event.offsetY / this.imageDimensions.height * 100
    }

    // Move the cropped thumbnail depending on mouse position
    const position = positionThumbnail(this.imgElement, offset);

    // Give data about current element back to parent action
    this.args.mouseMoveAction(offset, position);
  }

  didInsertElement() {
    super.didInsertElement(...arguments);
    this.element.addEventListener('mousemove', this.handleMouseMove);
    this.element.addEventListener('mouseenter', this.handleMouseEnter);
    this.element.addEventListener('mouseleave', this.handleMouseLeave);
  }

  willDestroyElement() {
    super.willDestroyElement(...arguments);
    this.element.removeEventListener('mousemove', this.handleMouseMove);
    this.element.removeEventListener('mouseenter', this.handleMouseEnter);
    this.element.removeEventListener('mouseleave', this.handleMouseLeave);
  }
}

function positionThumbnail(imgElement, offset) {
  // Shrink the movement range down so mouse doesn't need to be in the extremes to move the whole image
  const position = {
    x: (offset.x - 50) * RANGE_SHRINK + 50,
    y: (offset.y - 50) * RANGE_SHRINK + 50
  }
  if (position.x < 0) position.x = 0;
  if (position.x > 100) position.x = 100;
  if (position.y < 0) position.y = 0;
  if (position.y > 100) position.y = 100;
  // Move the image
  imgElement.style.objectPosition = `${position.x}% ${position.y}%`;

  return position;
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
