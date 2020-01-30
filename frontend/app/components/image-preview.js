import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from "@glimmer/tracking";

const MAX_ZOOM = 1.5;
const CONTAINER_PADDING = 10;
const RANGE_SHRINK = 0.9; // Percentage of smaller boundary

export default
class ImagePreview extends Component {
  @tracked container;

  @action
  moveImage(imgElement) {
    const mousePosition = this.args.mouseThumbnailPosition;

    // inner box reduced by equal pixels for top and sides. Just use the smallest.
    const rangeX = (this.container.width / RANGE_SHRINK) - this.container.width;
    const rangeY = (this.container.height / RANGE_SHRINK) - this.container.height;
    const rangeShrink = rangeX >= rangeY ? rangeX : rangeY;

    let innerRatioX = (this.container.width - rangeShrink * 2) / this.container.width;
    let innerRatioY = (this.container.height - rangeShrink * 2) / this.container.height
innerRatioX = 1; innerRatioY = 1
    // Offset is between 0 and 100. Make it -50 to +50, apply shrink then return to normal.
    let x = (mousePosition.offsetX - 50) / innerRatioX + 50;
    let y = (mousePosition.offsetY - 50) / innerRatioY + 50;

    // Bounding box
    if (x < 0) x = 0;
    if (x > 100) x = 100;
    if (y < 0) y = 0;
    if (y > 100) y = 100;

    // x = x * this.zoomLevel;
    // y = y * this.zoomLevel;

    // Move the image
    this.imagePreviewElement.style.objectPosition = `${x}% ${y}%`;
    console.log(`zoom: ${this.zoomLevel} x:${x} y:${y} container width:${this.container.width} img width:${this.imagePreviewElement.width}`)


    // // Shrink the movement range down so mouse doesn't need to be in the extremes to move the whole image
    // let x = (mousePosition.offsetX - 50) * RANGE_SHRINK + 50;
    // let y = (mousePosition.offsetY - 50) * RANGE_SHRINK + 50;
    //
    // if (x < 0) x = 0;
    // if (x > 100 / this.zoomLevel) x = 100 / this.zoomLevel;
    // if (y < 0) y = 0;
    // if (y > 100 / this.zoomLevel) y = 100 / this.zoomLevel;
    //
    // x = x * (1 - 1 / this.zoomLevel);
    // y = y * (1 - 1 / this.zoomLevel);
    //
    // // Move the image
    // imgElement.style.transform = `translate(-${x}%, -${y}%)`;
  }

  @action
  setupContainer(element) {
    const maxContainerSize = this.maxContainerSize();
    let c = this.fitInsideContainer(maxContainerSize, this.imagePreviewElement);
    c = this.positionContainer(c);

    // const element = this.element.querySelector('.image-preview');
    element.style.width = c.width + 'px';
    element.style.height = c.height + 'px';
    element.style.top = c.top + 'px';
    element.style.left = c.left + 'px';

    this.zoomLevel = this.calculateZoom(c);
    this.imagePreviewElement.style.width = `${c.width * this.zoomLevel}px`;
    this.imagePreviewElement.style.height = `${c.height * this.zoomLevel}px`;

    // Save the container element,
    this.container = c;
  }

  // Calculate max dimensions for preview container
  maxContainerSize() {
    // Width is from the right of listing images plus the padding
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    const width = windowWidth - this.args.thumbnailListingContainer.right - CONTAINER_PADDING * 2 - 15;
//******************************************************
// TODO: CHANGE -15 to SCROLLBAR WIDTH
//******************************************************
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const height = windowHeight - CONTAINER_PADDING * 2;
    const aspect = width / height;

    return { width: width, height: height, aspect: aspect };
  }

  imageSize() {
    const height = this.imagePreviewElement.naturalHeight;
    const width = this.imagePreviewElement.naturalWidth;
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
    const left = this.args.thumbnailListingContainer.right + CONTAINER_PADDING;
    let top = this.args.thumbnailListingContainer.middle - container.height / 2;

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
