// assets/js/main.js
(() => {
  // 简易 store，方便你以后扩展
  window.store = {
    state: { config: {} },
    dispatch() {}
  };

  const cfg = window.configData || {};
  const state = store.state.config;

  state.countdownTargetTime = cfg.countdownTargetTime || "2026-01-23T00:00:00";
  state.autoLaunch = !!cfg.autoLaunch;
  state.longExposure = !!cfg.longExposure;
  state.wordShell = !!cfg.wordShell;
  state.fireworkText = Array.isArray(cfg.fireworkText) ? cfg.fireworkText : [];

  // 绑定 DOM
  const menu = document.querySelector(".menu");
  const openBtn = document.querySelector(".open-menu-btn");
  const closeBtn = document.querySelector(".close-menu-btn");
  const launchNowBtn = document.querySelector(".launch-now-btn");

  const inputTarget = document.querySelector(".countdown-target");
  const inputAuto = document.querySelector(".auto-launch");
  const inputLong = document.querySelector(".long-exposure");
  const inputWord = document.querySelector(".word-shell");
  const inputText = document.querySelector(".firework-text");

  const countdownText = document.getElementById("countdownText");

  function showMenu(){ menu.classList.remove("hide"); }
  function hideMenu(){ menu.classList.add("hide"); }

  openBtn.addEventListener("click", showMenu);
  closeBtn.addEventListener("click", hideMenu);

  // 初始化表单
  inputTarget.value = state.countdownTargetTime;
  inputAuto.checked = state.autoLaunch;
  inputLong.checked = state.longExposure;
  inputWord.checked = state.wordShell;
  inputText.value = state.fireworkText.join("\n");

  // 表单 -> state
  inputTarget.addEventListener("change", () => { state.countdownTargetTime = inputTarget.value; });
  inputAuto.addEventListener("change", () => { state.autoLaunch = inputAuto.checked; });
  inputLong.addEventListener("change", () => { state.longExposure = inputLong.checked; });
  inputWord.addEventListener("change", () => { state.wordShell = inputWord.checked; });
  inputText.addEventListener("input", () => {
    state.fireworkText = inputText.value.split("\n").map(s => s.trim()).filter(Boolean);
  });

  // 倒计时逻辑
  let finale = false;

  function pad(n){ return String(n).padStart(2, "0"); }

  function updateCountdown() {
    const target = new Date(state.countdownTargetTime).getTime();
    const now = Date.now();

    if (!Number.isFinite(target)) {
      countdownText.textContent = "目标时间格式不正确";
      return;
    }

    let diff = target - now;
    if (diff <= 0) {
      countdownText.textContent = "放假啦 🎉";
      finale = true;
      return;
    }

    const d = Math.floor(diff / 86400000); diff %= 86400000;
    const h = Math.floor(diff / 3600000); diff %= 3600000;
    const m = Math.floor(diff / 60000);   diff %= 60000;
    const s = Math.floor(diff / 1000);

    countdownText.textContent = `${d} 天 ${pad(h)}:${pad(m)}:${pad(s)}`;
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // 发射策略：自动发射 + 倒计时结束 finale 更密集
  let lastLaunch = 0;

  function randomText() {
    if (!state.wordShell) return null;
    if (!state.fireworkText || state.fireworkText.length === 0) return null;
    return state.fireworkText[Math.floor(Math.random() * state.fireworkText.length)];
  }

  function launchOne(clientX, clientY) {
    const x = Stage.toCanvasX(clientX);
    const y = Stage.height;
    const targetY = M.rand(Stage.height * 0.18, Stage.height * 0.55);
    Fireworks.launch(x, y, targetY, randomText());
  }

  launchNowBtn.addEventListener("click", () => {
    Fireworks.launch(M.rand(Stage.width * 0.2, Stage.width * 0.8), Stage.height, undefined, randomText());
  });

  window.addEventListener("pointerdown", (e) => {
    // 点击发射
    launchOne(e.clientX, e.clientY);
  });

  function tick(ts) {
    requestAnimationFrame(tick);

    Stage.clear(state.longExposure);

    const interval = finale ? 150 : 650;
    if (state.autoLaunch && ts - lastLaunch > interval) {
      lastLaunch = ts;
      Fireworks.launch(
        M.rand(Stage.width * 0.15, Stage.width * 0.85),
        Stage.height,
        finale ? M.rand(Stage.height * 0.12, Stage.height * 0.45) : undefined,
        randomText()
      );
    }

    Fireworks.updateAndDraw();
  }

  requestAnimationFrame(tick);
  document.body.classList.remove("loading");
})();
