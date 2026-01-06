// assets/js/stage.js
window.Stage = (() => {
  const trails = document.getElementById("trails-canvas");
  const main = document.getElementById("main-canvas");
  const tctx = trails.getContext("2d");
  const mctx = main.getContext("2d");

  let dpr = 1;

  function resize() {
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const w = Math.floor(window.innerWidth * dpr);
    const h = Math.floor(window.innerHeight * dpr);
    trails.width = w; trails.height = h;
    main.width = w; main.height = h;
    trails.style.width = "100%"; trails.style.height = "100%";
    main.style.width = "100%"; main.style.height = "100%";
    tctx.setTransform(1,0,0,1,0,0);
    mctx.setTransform(1,0,0,1,0,0);
  }

  function clear(longExposure) {
    // trails：控制残影强度
    tctx.fillStyle = longExposure ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.28)";
    tctx.fillRect(0, 0, trails.width, trails.height);

    // main：每帧清空
    mctx.clearRect(0, 0, main.width, main.height);
  }

  function toCanvasX(clientX) { return clientX * dpr; }
  function toCanvasY(clientY) { return clientY * dpr; }

  window.addEventListener("resize", resize);
  resize();

  return {
    trails, main, tctx, mctx,
    get width(){ return main.width; },
    get height(){ return main.height; },
    clear,
    toCanvasX,
    toCanvasY
  };
})();
