// Landing background: a slow network of nodes in the chapter colours, with packets travelling
// along the links — agents talking to tools. Pauses when the tab is hidden; static when the
// user prefers reduced motion.
(() => {
  const canvas = document.getElementById('bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const colors = (window.COURSE?.chapters || []).map((c) => c.color).filter((c) => c !== '#000000');
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const LINK = 150;
  let w, h, dpr, nodes = [], packets = [], mouse = { x: -1e4, y: -1e4 }, frame;

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = innerWidth; h = innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(90, (w * h) / 16000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.15,
      r: 1 + Math.random() * 1.8,
      c: colors[Math.floor(Math.random() * colors.length)] || '#3ee6ff',
    }));
    packets = [];
  }

  function step() {
    ctx.clearRect(0, 0, w, h);
    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
      // Gentle pull towards the pointer.
      const dx = mouse.x - n.x, dy = mouse.y - n.y, d = Math.hypot(dx, dy);
      if (d < 200) { n.x += dx * 0.002; n.y += dy * 0.002; }
    }
    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d > LINK) continue;
        ctx.strokeStyle = `rgba(170, 190, 225, ${0.07 * (1 - d / LINK)})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        if (!still && packets.length < 6 && Math.random() < 0.0003) packets.push({ a, b, t: 0 });
      }
    }
    for (const n of nodes) {
      ctx.fillStyle = n.c; ctx.globalAlpha = 0.35;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    packets = packets.filter((p) => (p.t += 0.007) < 1 && Math.hypot(p.a.x - p.b.x, p.a.y - p.b.y) < LINK);
    for (const p of packets) {
      const x = p.a.x + (p.b.x - p.a.x) * p.t, y = p.a.y + (p.b.y - p.a.y) * p.t;
      ctx.shadowColor = p.a.c; ctx.shadowBlur = 8; ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.beginPath(); ctx.arc(x, y, 1.8, 0, Math.PI * 2); ctx.fill();
    }
    ctx.shadowBlur = 0;
    if (!still) frame = requestAnimationFrame(step);
  }

  resize(); step();
  addEventListener('resize', () => { resize(); if (still) step(); });
  addEventListener('pointermove', (e) => { mouse = { x: e.clientX, y: e.clientY }; });
  document.addEventListener('visibilitychange', () => {
    if (still) return;
    if (document.hidden) cancelAnimationFrame(frame); else frame = requestAnimationFrame(step);
  });
})();
