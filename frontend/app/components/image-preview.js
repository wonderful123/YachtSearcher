import Component from '@ember/component';
import { action } from '@ember/object';

const MAX_ZOOM = 1.5;
const CONTAINER_PADDING = 10;

export default
class ImagePreview extends Component {
  // Calculate max dimensions for preview container
  containerSize() {
    // Width is from the right of listing images plus the padding
    const windowWidth = this.$(window).width();
    const width = windowWidth - this.thumbnailListPosition.right - CONTAINER_PADDING * 2;
    const windowHeight = this.$(window).height();
    const height = windowHeight - CONTAINER_PADDING * 2;
    const aspect = width / height;

    return { width: width, height: height, aspect: aspect };
  }

  imageSize() {
    const height = this.$('img')[0].naturalHeight;
    const width = this.$('img')[0].naturalWidth;
    const aspect = width / height;

    return { width: width, height: height, aspect: aspect };
  }

  // Calculate the container dimensions keeping image aspect ratio
  fitContainer() {
    let container = this.containerSize();
    const image = this.imageSize();


    // IF container aspect taller than image then shrink vertically.
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
  containerPosition(container) {
    const left = this.thumbnailListPosition.right + CONTAINER_PADDING;
    let top = this.thumbnailListPosition.middle - container.height / 2;

    // Check not above top of window
    if (top - CONTAINER_PADDING < 0) {
      top = CONTAINER_PADDING
    }

    // Check not below bottom
    const windowHeight = this.$(window).height();
    if (top + container.height + CONTAINER_PADDING > windowHeight)
    {
      top = windowHeight - container.height - CONTAINER_PADDING;
    }

    container.top = top;
    container.left = left;

    return container;
  }

  // Get the container dimensions and position respecting image aspect
  getContainer() {
    let container = this.fitContainer();
    container = this.containerPosition(container);

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

  @action
  setImagePosition() {
    const c = this.getContainer();

    this.$('.image-preview').css({top: c.top, left: c.left, width: c.width, height: c.height});

    const zoomLevel = this.calculateZoom(c);
    this.$('.image-preview').css({
      'background-image': `url(${this.url})`,
      'background-size': `${c.width * zoomLevel}px ${c.height * zoomLevel}px`
    });

    this.$('.image-preview').clearQueue().animate({
      'background-position-x': `${this.offsetX}%`,
      'background-position-y': `${this.offsetY}%`
    }, 10)

    // Calculate the translate factor. It depends on zoom level and image size
    const previewWidth = c.width * zoomLevel;

    const left = previewWidth * this.offsetX * (1 - 1 / zoomLevel) / 100;
    const top = c.height * zoomLevel * this.offsetY * (1 - 1 / zoomLevel) / 100;

    const translateX = this.offsetX * (1 - 1 / zoomLevel);
    const translateY = this.offsetY * (1 - 1 / zoomLevel);

    // this.$('.image-preview-container img')
    // .css({
    //   width: previewWidth,
    //   height: 'auto',
    //   position: 'absolute',
    // })
    // this.$('.image-preview-container img')
    // .finish()
    // .animate({
    //   top: -top,
    //   left: -left
    //   // 'transform', `translate(${-translateX}%, ${-translateY}%)`
    // }, 10)
  }
}
