// assets/js/mymath.js
window.M = {
  rand(min, max) { return Math.random() * (max - min) + min; },
  randInt(min, max) { return Math.floor(window.M.rand(min, max + 1)); },
  clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
};
