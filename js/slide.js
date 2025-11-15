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
    this.wrapper.removeEventListener("mousemove", this.onMouseMove);
    this.dist.distFinal = this.dist.distDiff;
  }

  _onMouseMove(e) {
    this.dist.distDiff = e.clientX - this.dist.startx;
    this.slideMove(this.dist.distDiff * 1.6);
  }

  _onMouseDown(e) {
    e.preventDefault();
    this.dist.startx = e.clientX - this.dist.distFinal;
    this.wrapper.addEventListener("mousemove", this.onMouseMove);
  }

  onStart() {
    this.wrapper.addEventListener("mousedown", this.onMouseDown);
    this.wrapper.addEventListener("mouseup", this.onMouseUp);
  }

  init() {
    this.onStart();
  }
}
