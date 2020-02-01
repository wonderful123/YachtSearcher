import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from "@glimmer/tracking";

const MAX_ZOOM = 1.5;
const CONTAINER_PADDING = 10;
const RANGE_SHRINK = 0.9; // Percentage of smaller boundary

export default
class ImagePreview extends Component {
  @tracked containerElement;
  @tracked containerDimensions;

  @action
  moveImage(imgElement) {
    this.setupContainer(this.containerElement);
    const c = this.containerDimensions;
    const mousePosition = this.args.mouseThumbnailPosition;

    imgElement.style.width = `${c.width * this.zoomLevel}px`;
    imgElement.style.height = `${c.height * this.zoomLevel}px`;

    // inner box reduced by equal pixels for top and sides. Just use the smallest.
    const rangeX = (c.width / RANGE_SHRINK) - c.width;
    const rangeY = (c.height / RANGE_SHRINK) - c.height;
    const rangeShrink = rangeX >= rangeY ? rangeX : rangeY;

    let innerRatioX = (c.width - rangeShrink * 2) / c.width;
    let innerRatioY = (c.height - rangeShrink * 2) / c.height

    // Offset is between 0 and 100. Make it -50 to +50, apply shrink then return to normal.
    let x = (mousePosition.offsetX - 50) / innerRatioX + 50;
    let y = (mousePosition.offsetY - 50) / innerRatioY + 50;

    // Bounding box
    if (x < 0) x = 0;
    if (x > 100) x = 100;
    if (y < 0) y = 0;
    if (y > 100) y = 100;

    let percentX = -x * (this.zoomLevel - 1);
    let percentY = -y * (this.zoomLevel - 1);

    imgElement.style.top = `${percentY}%`
    imgElement.style.left = `${percentX}%`
  }

  get active() {
    return this.args.isActive;
  }

  @action
  setupContainer(containerElement) {
    // Calculate maximum container size and fit/position the image within that container
    let c = this.fitPreviewToContainer(this.maxContainerSize, containerElement);
    c = this.positionContainer(c);

    containerElement.style.width = c.width + 'px';
    containerElement.style.height = c.height + 'px';
    containerElement.style.top = c.top + 'px';
    containerElement.style.left = c.left + 'px';

    this.zoomLevel = this.calculateZoom(c);

    // Store elements in class
    this.containerElement = containerElement;
    this.containerDimensions = c;
  }

  get listingContainerDimensions() {
    // Calculate position of right side of listing images so preview can be shown on the right.
    const elementBoundingRect = this.args.listingImagesContainer.getBoundingClientRect();

    return {
      right: elementBoundingRect.right,
      middle: elementBoundingRect.top + elementBoundingRect.height / 2
    }
  }

  // Calculate max dimensions for preview container
  get maxContainerSize() {
    // Width is from the right of listing images plus the padding to right side of window
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    const width = windowWidth - this.listingContainerDimensions.right - CONTAINER_PADDING * 2 - 15;
//******************************************************
// TODO: CHANGE -15 to SCROLLBAR WIDTH
//******************************************************
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const height = windowHeight - CONTAINER_PADDING * 2;
    const aspect = width / height;

    return { width: width, height: height, aspect: aspect };
  }

  get imageDimensions() {
    const height = this.imageElement.naturalHeight;
    const width = this.imageElement.naturalWidth;
    const aspect = width / height;

    return { width: width, height: height, aspect: aspect };
  }

  // Calculate the container dimensions inside the max size keeping image aspect ratio
  fitPreviewToContainer(container) {
    // If container aspect taller than image then shrink to fit.
    if (container.aspect < this.imageDimensions.aspect) {
      container.height = container.width / this.imageDimensions.aspect;
    } else {
      container.width = container.height * this.imageDimensions.aspect;
    }

    // No point making container bigger than image resolution. Set it to that if so
    if (this.imageDimensions.width < container.width) {
      container.width = this.imageDimensions.width;
      container.height = this.imageDimensions.height;
    }

    return { width: container.width, height: container.height };
  }

  // Returns top and left position for container.
  // Try to align preview with middle of thumbnail but bouce off top and bottom of window
  positionContainer(container) {
    const left = this.listingContainerDimensions.right + CONTAINER_PADDING;
    let top = this.listingContainerDimensions.middle - container.height / 2;

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
    let zoom = this.imageDimensions.width / container.width;

    // Cap the zoom level
    if (zoom > MAX_ZOOM) zoom = MAX_ZOOM;

    return zoom;
  }
}
