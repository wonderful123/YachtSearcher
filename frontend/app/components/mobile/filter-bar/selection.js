import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Glide from '@glidejs/glide';

export default class FilterBarSelectionComponent extends Component {
  @tracked selectedIndex = null;
  @tracked dialogActive = null;

  get isDialogShown() {
    // Check active dialog and active filter component
    if (this.args.isShown && this.dialogActive) return true;
    else return false;
  }

  @action
  registerGlide(element) {
    // Didn't know how to extract the transition component from glide. Roundabout way but it works.
    var component;
    var transitionGetter = function(Glide, Components) {
      return {
        mount() {
          component = Components.Transition;
        }
      }
    };

    this.glide = new Glide(element, {
      gap: '2rem',
      swipeThreshold: false,
      dragThreshold: false
    }).mount({ transitionGetter: transitionGetter });

    // Automated height on Carousel build
  this.glide.on('build.after', function () {
    glideHandleHeight();
});

// Automated height on Carousel change
  this.glide.on('run.after', function () {
    glideHandleHeight();
});

// Mount!
  this.glide.mount({
    type: 'carousel',
});

// Resize height
function glideHandleHeight() {
    const activeSlide = document.querySelector('.glide__slide--active');
    const activeSlideHeight = activeSlide ? activeSlide.offsetHeight : 0;

    const glideTrack = document.querySelector('.glide__track');
    const glideTrackHeight = glideTrack ? glideTrack.offsetHeight : 0;

    if (activeSlideHeight !== glideTrackHeight) {
        glideTrack.style.height = `${activeSlideHeight}px`;
    }
}

    this.sliderTransition = component;

    this.glide.on('run', this.move);
  }

  @action
  move() {
    // If it's the first time a dialog is selected then set the starting slide.
    // Disable the animation so it doesn't pop up and slide.
    if (this.selectedIndex === null) {
      this.sliderTransition.disable();
      this.glide.update({ startAt: this.glide.index });
      this.dialogActive = true;
      this.sliderTransition.enable();
    }

    // If same selection then toggle dialog
    if (this.glide.index === this.selectedIndex) {
      this.dialogActive = !this.dialogActive;
    // Otherwise a new selection so show dialog
    } else {
      this.dialogActive = true;
    }

    // Update active index of slide
    this.selectedIndex = this.glide.index;

    if (!this.dialogActive) this.selectedIndex = null;
  }
}
