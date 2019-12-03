import Component from '@ember/component';
import { action } from '@ember/object';
import $ from 'jquery';

const ZOOM_LEVEL = 1.5;

export default Component.extend({
  @action
  handleMouseMovement(event) {
    const p = calculateZoomOverlay({x: event.pageX, y: event.pageY}, $(event.target));
    moveCursorOverlay(p.left, p.top);
    movePreviewBackground(p.offsetX, p.offsetY);
  }
});

function moveCursorOverlay(left, top) {
   $('.zoom-overlay').css({
    top: top,
    left: left
  });
}

function movePreviewBackground(offsetX, offsetY) {
  $('.image-preview').css({
    'background-position': offsetX + '% ' + offsetY + '%'
  });
}

function calculateZoomOverlay(mouse, thumb) {
  let t = thumb.position();
  t.width = thumb.width();
  t.height = thumb.height();

  let z = {}; // Zoom overlay
  z.width = t.width / ZOOM_LEVEL;
  z.height = t.height / ZOOM_LEVEL;
  z.top = mouse.y - z.height / 2;
  z.left = mouse.x - z.width / 2;

  // Bounce off boundary
  if (z.top < t.top) z.top = t.top;
  if (z.left < t.left) z.left = t.left;
  if (z.top + z.height > t.top + t.height) z.top = t.top + t.height - z.height;
  if (z.left + z.width > t.left + t.width) z.left = t.left + t.width - z.width;

  z.offsetX = (z.left - t.left) / z.width * 100;
  z.offsetY = (z.top - t.top) / z.height * 100;

  return z;
}
