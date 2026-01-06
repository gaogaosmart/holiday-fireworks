// assets/js/fireworks.js
window.Fireworks = (() => {
  const rockets = [];
  const particles = [];

  function launch(x, y, targetY, text) {
    rockets.push({
      x, y,
      vx: M.rand(-0.5, 0.5),
      vy: M.rand(-11.5, -9.0),
      targetY: targetY ?? M.rand(Stage.height * 0.22, Stage.height * 0.55),
      hue: M.rand(0, 360),
      text: text || null
    });
  }

  function explode(x, y, hue, text) {
    const n = M.randInt(80, 140);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = M.rand(2.0, 7.0);
      particles.push({
        x, y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        life: M.randInt(55, 95),
        hue,
        size: M.rand(1.2, 2.4)
      });
    }

    // 文字烟花（很轻量：在爆点附近显示文字粒子/文字效果）
    if (text) {
      particles.push({
        x, y,
        vx: 0,
        vy: 0,
        life: 80,
        hue,
        size: 0,
        text
      });
    }
  }

  function updateAndDraw() {
    const { tctx, mctx } = Stage;

    // 火箭
    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i];
      r.x += r.vx;
      r.y += r.vy;
      r.vy += 0.08;

      // trails 画尾焰
      tctx.fillStyle = `hsla(${r.hue}, 100%, 70%, 0.9)`;
      tctx.fillRect(r.x, r.y, 2, 9);

      if (r.y <= r.targetY) {
        rockets.splice(i, 1);
        explode(r.x, r.y, r.hue, r.text);
      }
    }

    // 粒子
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life -= 1;

      if (p.text) {
        const alpha = M.clamp(p.life / 80, 0, 1);
        mctx.save();
        mctx.globalAlpha = alpha;
        mctx.fillStyle = `hsla(${p.hue}, 100%, 75%, 1)`;
        mctx.font = `${Math.floor(28)}px system-ui, -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif`;
        mctx.textAlign = "center";
        mctx.textBaseline = "middle";
        mctx.shadowColor = "rgba(255,255,255,0.35)";
        mctx.shadowBlur = 12;
        mctx.fillText(p.text, p.x, p.y);
        mctx.restore();

        if (p.life <= 0) particles.splice(i, 1);
        continue;
      }

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.06;
      p.vx *= 0.985;
      p.vy *= 0.985;

      const alpha = M.clamp(p.life / 95, 0, 1);
      mctx.fillStyle = `hsla(${p.hue}, 100%, 65%, ${alpha})`;
      mctx.beginPath();
      mctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      mctx.fill();

      if (p.life <= 0) particles.splice(i, 1);
    }
  }

  return {
    launch,
    updateAndDraw
  };
})();
