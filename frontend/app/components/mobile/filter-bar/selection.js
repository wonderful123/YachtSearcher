import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Glide from '@glidejs/glide';

export default class FilterBarSelectionComponent extends Component {
  @tracked selectedIndex = null;
  @tracked dialogActive = null;

  get isShown() {
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
      gap: 0
    }).mount({ transitionGetter: transitionGetter });

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
