import Component from '@glimmer/component';
import { action } from '@ember/object';
import Swiper from 'swiper';

export default class CarouselComponent extends Component {
  get imageCount() {
    return this.args.images.length;
  }

  @action
  registerSwiper(element) {
    // const galleryThumbs = new Swiper(element.querySelector('.gallery-thumbs'), {
    //   spaceBetween: 3,
    //   slidesPerView: 6,
    //   slidesPerGroup: 6,
    //   loop: true,
    //   freeMode: true,
    //   loopedSlides: this.imageCount, //looped slides should be the same
    //   watchSlidesVisibility: true,
    //   watchSlidesProgress: true,
    //   centeredSlides: true,
    // });

    new Swiper(element.querySelector('.gallery-top'), {
      spaceBetween: 0,
      loop: true,
      loopedSlides: this.imageCount, //looped slides should be the same
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      // thumbs: {
      //   swiper: galleryThumbs,
      // },
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
