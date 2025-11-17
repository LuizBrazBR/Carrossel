import { SliderButton } from "./slide.js";

const slider = new SliderButton(".slider", ".wrapper");
slider.onNav(".prev", ".next");
slider.init();
