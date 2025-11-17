import debounce from "./debounce.js";

export class Slider {
  constructor(slider, wrapper) {
    this.slider = document.querySelector(slider);
    this.wrapper = document.querySelector(wrapper);
    this.onMouseDown = (e) => {
      this._onMouseDown(e);
    };
    this.onMouseMove = (e) => {
      this._onMouseMove(e);
    };
    this.onMouseUp = (e) => {
      this._onMouseUp(e);
    };

    this.onPrev = () => {
      this._onPrev();
    };

    this.onNext = () => {
      this._onNext();
    };

    this.onResize = debounce(() => {
      this._onResize();
    }, 100);

    this.dist = {
      startx: 0,
      distDiff: 0,
      distFinal: 0,
    };

    this.slideStatus = {
      prev: null,
      current: 0,
      next: 1,
    };
  }

  setStyle(active) {
    active
      ? (this.slider.style.transition = "0.3s")
      : (this.slider.style.transition = "");
  }

  getSlidePosition() {
    const slides = [...this.slider.children].map((element) => {
      const total = (this.wrapper.offsetWidth - element.offsetWidth) / 2;
      const offsetLeft = element.offsetLeft - total;
      return {
        element,
        offsetLeft,
      };
    });
    return slides;
  }

  goToSlide(index) {
    this.slideMove(-this.getSlidePosition()[index].offsetLeft);
    this.getIndex(index);
    this.dist.distFinal = -this.getSlidePosition()[index].offsetLeft;
  }

  getIndex(index) {
    const length = this.getSlidePosition().length - 1;
    (this.slideStatus.current = index),
      (this.slideStatus.prev = this.slideStatus.current
        ? this.slideStatus.current - 1
        : null),
      (this.slideStatus.next =
        this.slideStatus.current + 1 > length
          ? null
          : this.slideStatus.current + 1);
  }

  slideMove(diff) {
    this.slider.style.transform = `translate3d(${diff}px, 0, 0)`;
  }

  _onMouseUp(e) {
    if (e.type === "mouseup") {
      this.wrapper.removeEventListener("mousemove", this.onMouseMove);
    } else {
      this.wrapper.removeEventListener("touchmove", this.onMouseMove);
    }
    this.dist.distFinal = this.dist.distDiff;
    this.setStyle(true);
    if (
      this.dist.distDiff <
      -this.getSlidePosition()[this.slideStatus.current].offsetLeft - 50
    ) {
      this.onNext();
    } else if (
      this.dist.distDiff >
      -this.getSlidePosition()[this.slideStatus.current].offsetLeft + 50
    ) {
      this.onPrev();
    }
    this.onCurrent();
  }

  _onPrev() {
    if (this.slideStatus.prev !== null) {
      this.setStyle(true);
      this.goToSlide(this.slideStatus.prev);
      this.onCurrent();
    } else {
      this.goToSlide(this.slideStatus.current);
    }
  }

  _onNext() {
    if (this.slideStatus.next !== null) {
      this.setStyle(true);
      this.goToSlide(this.slideStatus.next);
      this.onCurrent();
    } else {
      this.goToSlide(this.slideStatus.current);
    }
  }

  _onMouseMove(e) {
    if (e.type === "mousemove") {
      this.dist.distDiff = e.clientX - this.dist.startx;
    } else {
      e.preventDefault();
      this.dist.distDiff = e.touches[0].clientX - this.dist.startx;
    }
    this.slideMove(this.dist.distDiff);
  }

  _onMouseDown(e) {
    e.preventDefault();
    this.setStyle(false);
    if (e.type === "mousedown") {
      this.wrapper.addEventListener("mousemove", this.onMouseMove);
      this.dist.startx = e.clientX - this.dist.distFinal;
    } else {
      this.wrapper.addEventListener("touchmove", this.onMouseMove);
      this.dist.startx = e.touches[0].clientX - this.dist.distFinal;
    }
  }

  onStart() {
    this.wrapper.addEventListener("mousedown", this.onMouseDown);
    this.wrapper.addEventListener("touchstart", this.onMouseDown);
    this.wrapper.addEventListener("mouseup", this.onMouseUp);
    this.wrapper.addEventListener("touchend", this.onMouseUp);
  }

  onCurrent() {
    this.slides = [...this.slider.children];
    this.slides.forEach((e) => {
      e.classList.remove("active");
    });
    this.slides[this.slideStatus.current].classList.add("active");
  }

  _onResize() {
    setTimeout(() => {
      this.getSlidePosition();
      this.goToSlide(this.slideStatus.current);
    }, 300);
  }

  addResizeEvent() {
    window.addEventListener("resize", this.onResize);
  }

  init() {
    this.addResizeEvent();
    this.goToSlide(0);
    this.onCurrent();
    this.onStart();
  }
}

export class SliderButton extends Slider {
  onNav(prev, next) {
    this.prevArrow = document.querySelector(prev);
    this.nextArrow = document.querySelector(next);
    this.onNavEvent();
  }

  onNavEvent() {
    this.prevArrow.addEventListener("click", this.onPrev);
    this.nextArrow.addEventListener("click", this.onNext);
  }
}
