import Component from '@glimmer/component';
import { action } from '@ember/object';
import Swiper from 'swiper';

export default class CarouselComponent extends Component {
  get imageCount() {
    return this.args.images.length;
  }

  @action
  registerSwiper(element) {
    new Swiper(element.querySelector('.swiper-container'), {
      spaceBetween: 0,
      loop: true,
      loopedSlides: this.imageCount, //looped slides should be the same
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        dynamicBullets: true,
      },
      preloadImages: false,
      lazy: {
        loadPrevNext: true,
      },
    });
  }
}
