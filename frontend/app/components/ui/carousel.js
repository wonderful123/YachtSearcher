import Component from '@glimmer/component';
import { action } from '@ember/object';
import Glide from '@glidejs/glide'

export default class CarouselComponent extends Component {
  get imageCount() {
    return this.args.images.length;
  }

  get navElements() {
    return new Array(this.imageCount);
  }

  @action
  registerGlide(element) {
    new Glide(element.querySelector('.carousel'), {
      gap: 0,
    }).mount();
  }
}
