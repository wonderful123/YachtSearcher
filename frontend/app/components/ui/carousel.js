import Component from '@glimmer/component';
import { action } from '@ember/object';
import Glide from '@glidejs/glide';

export default class CarouselComponent extends Component {
  get imageCount() {
    return this.args.images.length;
  }

  get navBullets() {
    return new Array(this.imageCount);
  }

  @action
  registerGlide(element) {
    this.glide = new Glide(element, {
      gap: '10%',
    }).mount();

    this.glide.on('run', this.move);
  }

  @action
  move() {
    // Update active index of slide
    const currentIndex = this.glide.index;
    this.setBullets(currentIndex);
  }

  @action
  setupBullets(element) {
    this.bulletsElement = element;
    this.bullets = element.getElementsByClassName('glide__bullet');

    // Check if there are no bullets
    if (this.bullets.length > 0) {
      // Calculate mid offset of bullet
      const style = window.getComputedStyle(this.bullets[0]);
      this.bulletOffset = parseFloat(style.width) / 2 + parseFloat(style.marginLeft) + 'px';

      this.setBullets(0);
    }
  }

  @action
  setBullets(currentIndex = 0) {
    // Add/remove classes on each bullet
    for (let i = 0; i < this.bullets.length; i++) {
      const bullet = this.bullets[i];
      bullet.classList.remove("inactive");
      bullet.classList.remove("active");
      bullet.classList.remove("small");
      bullet.classList.remove("smaller");

      if (i === currentIndex - 3 || i === currentIndex + 3) {
        bullet.classList.add("smaller");
      } else if (i === currentIndex - 2 || i === currentIndex + 2) {
        bullet.classList.add("small");
      } else if (i < currentIndex - 3 || i > currentIndex + 3) {
        bullet.classList.add("inactive");
      } else if (i === currentIndex) bullet.classList.add("active");
    }

    // Translate by percentage depending on how many bullets
    const translate = currentIndex * (100 / this.imageCount);
    this.bulletsElement.style.transform = `translateX(calc(-${translate}% - ${this.bulletOffset}))`;
  }
}
