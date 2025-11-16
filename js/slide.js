export default class Slider {
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

    this.dist = {
      startx: 0,
      distDiff: 0,
      distFinal: 0,
    };
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
  }

  _onMouseMove(e) {
    if (e.type === "mousemove") {
      this.dist.distDiff = e.clientX - this.dist.startx;
    } else {
      e.preventDefault();
      this.dist.distDiff = e.touches[0].clientX - this.dist.startx;
    }
    this.slideMove(this.dist.distDiff * 1.6);
  }

  _onMouseDown(e) {
    e.preventDefault();
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

  init() {
    this.onStart();
  }
}
