import Component from '@ember/component';
import { action, computed } from '@ember/object';

const MAX_ZOOM = 1.5;
const CONTAINER_PADDING = 10;
const RANGE_SHRINK = 2;

export default
class ImagePreview extends Component {
  @computed
  get imgElement() {
    return this.element.getElementsByTagName('img')[0];
  }

  @action
  moveImage() {
    // Shrink the movement range down so mouse doesn't need to be in the extremes to move the whole image
    let x = (this.offset.x - 50) * RANGE_SHRINK + 50;
    let y = (this.offset.y - 50) * RANGE_SHRINK + 50;

    if (x < 0) x = 0;
    if (x > 100 / this.zoomLevel) x = 100 / this.zoomLevel;
    if (y < 0) y = 0;
    if (y > 100 / this.zoomLevel) y = 100 / this.zoomLevel;

    x = x * (1 - 1 / this.zoomLevel);
    y = y * (1 - 1 / this.zoomLevel);

    // Move the image
    this.imgElement.style.transform = `translate(-${x}%, -${y}%)`;
  }

  @action
  setupContainer() {
    const maxContainerSize = this.maxContainerSize();
    let c = this.fitInsideContainer(maxContainerSize);
    c = this.positionContainer(c);

    const element = this.element.querySelector('.image-preview');
    element.style.width = c.width + 'px';
    element.style.height = c.height + 'px';
    element.style.top = c.top + 'px';
    element.style.left = c.left + 'px';

    this.set('zoomLevel', this.calculateZoom(c));
    this.imgElement.style.width = `${c.width * this.zoomLevel}px`;
    this.imgElement.style.height = `${c.height * this.zoomLevel}px`;
  }

  // Calculate max dimensions for preview container
  maxContainerSize() {
    // Width is from the right of listing images plus the padding
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    const width = windowWidth - this.thumbnailListContainer.right - CONTAINER_PADDING * 2 - 15;
//******************************************************
// TODO: CHANGE -15 to SCROLLBAR WIDTH
//******************************************************
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const height = windowHeight - CONTAINER_PADDING * 2;
    const aspect = width / height;

    return { width: width, height: height, aspect: aspect };
  }

  imageSize() {
    const height = this.imgElement.naturalHeight;
    const width = this.imgElement.naturalWidth;
    const aspect = width / height;

    return { width: width, height: height, aspect: aspect };
  }

  // Calculate the container dimensions inside the max size keeping image aspect ratio
  fitInsideContainer(maxSize) {
    let container = maxSize;
    const image = this.imageSize();

    // If container aspect taller than image then shrink to fit.
    if (container.aspect < image.aspect) {
      container.height = container.width / image.aspect;
    } else {
      container.width = container.height * image.aspect;
    }

    // No point making container bigger than image resolution. Set it to that if so
    if (image.width < container.width) {
      container.width = image.width;
      container.height = image.height;
    }

    return { width: container.width, height: container.height };
  }

  // Returns top and left position for container.
  // Try to align preview with middle of thumbnail but bouce off top and bottom of window
  positionContainer(container) {
    const left = this.thumbnailListContainer.right + CONTAINER_PADDING;
    let top = this.thumbnailListContainer.middle - container.height / 2;

    // Check not above top of window
    if (top - CONTAINER_PADDING < 0) {
      top = CONTAINER_PADDING
    }

    // Check not below bottom
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    if (top + container.height + CONTAINER_PADDING > windowHeight)
    {
      top = windowHeight - container.height - CONTAINER_PADDING;
    }

    container.top = top;
    container.left = left;

    return container;
  }

  // Calculates the zoom level of original image compared to container and capped at max
  calculateZoom(container) {
    // Aspect of container and image are the same so we can just compare widths
    let zoom = this.imageSize().width / container.width;

    // Cap the zoom level
    if (zoom > MAX_ZOOM) zoom = MAX_ZOOM;

    return zoom;
  }
}
