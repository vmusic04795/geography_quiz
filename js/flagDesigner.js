/* ═══════════════════════════════ FLAG DESIGNER ═══════════════════════════ */
const FlagDesigner = (() => {
  const NS = 'http://www.w3.org/2000/svg';
  const W = 300, H = 200;

  let state = {
    layout:      'h-stripe',
    stripeCount: 3,
    colors:      ['#CE1126', '#FFFFFF', '#003087'],
    symbol:      'none',
    symColor:    '#FFFFFF',
    symPos:      'center',
  };

  // ── Render SVG ────────────────────────────────────────────────────────────
  function render() {
    const svg = document.getElementById('flag-svg');
    if (!svg) return;
    svg.innerHTML = '';

    const { layout, stripeCount, colors: c, symbol, symColor, symPos } = state;

    switch (layout) {
      case 'h-stripe':     drawHStripes(svg, stripeCount, c);                      break;
      case 'v-stripe':     drawVStripes(svg, stripeCount, c);                      break;
      case 'triangle-left':drawTriangle(svg, c);                                   break;
      case 'canton-solid': drawCantonSolid(svg, c);                                break;
      case 'canton-stripe':drawCantonStripe(svg, stripeCount, c);                  break;
      case 'cross':        drawCross(svg, c);                                      break;
      case 'diagonal':     drawDiagonal(svg, c);                                   break;
      case 'solid':        drawRect(svg, 0, 0, W, H, c[0]);                        break;
    }

    if (symbol !== 'none') drawSymbol(svg, symbol, symColor, symPos, layout);
  }

  // ── Primitive helpers ─────────────────────────────────────────────────────
  function drawRect(parent, x, y, w, h, fill) {
    const el = document.createElementNS(NS, 'rect');
    el.setAttribute('x', x); el.setAttribute('y', y);
    el.setAttribute('width', w); el.setAttribute('height', h);
    el.setAttribute('fill', fill);
    parent.appendChild(el);
    return el;
  }

  function makePoly(parent, points, fill) {
    const el = document.createElementNS(NS, 'polygon');
    el.setAttribute('points', points);
    el.setAttribute('fill', fill);
    parent.appendChild(el);
  }

  // ── Layout renderers ──────────────────────────────────────────────────────
  function drawHStripes(svg, count, colors) {
    const sh = H / count;
    for (let i = 0; i < count; i++) drawRect(svg, 0, i * sh, W, sh, colors[i % colors.length]);
  }

  function drawVStripes(svg, count, colors) {
    const sw = W / count;
    for (let i = 0; i < count; i++) drawRect(svg, i * sw, 0, sw, H, colors[i % colors.length]);
  }

  function drawTriangle(svg, colors) {
    drawRect(svg, 0, 0, W, H / 2, colors[1] || '#FFFFFF');
    drawRect(svg, 0, H / 2, W, H / 2, colors[2] || '#009A44');
    makePoly(svg, `0,0 ${W * 0.42},${H / 2} 0,${H}`, colors[0]);
  }

  function drawCantonSolid(svg, colors) {
    // Full flag solid (color 0), canton box top-left (color 1)
    drawRect(svg, 0, 0, W, H, colors[0]);
    drawRect(svg, 0, 0, W * 0.44, H * 0.5, colors[1] || '#012169');
  }

  function drawCantonStripe(svg, count, colors) {
    // Horizontal stripes on full flag, then canton overlaid top-left
    const stripeColors = colors.slice(0, count);
    drawHStripes(svg, count, stripeColors);
    const cantonColor = colors[count] || colors[colors.length - 1] || '#012169';
    drawRect(svg, 0, 0, W * 0.44, H * 0.5, cantonColor);
  }

  function drawCross(svg, colors) {
    drawRect(svg, 0, 0, W, H, colors[0]);
    // Nordic cross — 5:2:9 horizontal, 4:2:4 vertical (Swedish proportions)
    drawRect(svg, 0,            H * 0.4,      W,           H * 0.2, colors[1] || '#FFFFFF');
    drawRect(svg, W * 0.3125,  0,             W * 0.125,   H,       colors[1] || '#FFFFFF');
  }

  function drawDiagonal(svg, colors) {
    makePoly(svg, `0,0 ${W},0 0,${H}`, colors[0]);
    makePoly(svg, `${W},0 ${W},${H} 0,${H}`, colors[1] || '#FFFFFF');
  }

  // ── Symbols ───────────────────────────────────────────────────────────────
  function symCenter(pos, layout) {
    switch (pos) {
      case 'canton': return { cx: W * 0.22, cy: H * 0.25 };
      case 'left':   return { cx: W * 0.17, cy: H * 0.5  };
      case 'corner': return { cx: W * 0.14, cy: H * 0.18 };
      default:       // 'center' — but offset for triangle layout
        return layout === 'triangle-left'
          ? { cx: W * 0.17, cy: H * 0.5 }
          : { cx: W * 0.5, cy: H * 0.5 };
    }
  }

  function drawSymbol(svg, symbol, color, pos, layout) {
    const { cx, cy } = symCenter(pos, layout);
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('fill', color);

    switch (symbol) {
      case 'star':     appendStar(g, cx, cy, 30, 13, 5);  break;
      case 'crescent': appendCrescent(g, cx, cy, 27);     break;
      case 'eclipse':  appendEclipse(g, cx, cy, 27);      break;
      case 'sun':      appendSun(g, cx, cy, 24, 8, color);break;
      case 'circle':   appendCircle(g, cx, cy, 25);       break;
      case 'cross-sym':appendCrossSym(g, cx, cy, 22);     break;
      case 'stars-3':
        appendStar(g, cx - 38, cy, 17, 7, 5);
        appendStar(g, cx,      cy, 17, 7, 5);
        appendStar(g, cx + 38, cy, 17, 7, 5);
        break;
    }
    svg.appendChild(g);
  }

  function appendStar(parent, cx, cy, outerR, innerR, points) {
    const pts = [];
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const a = (Math.PI / points) * i - Math.PI / 2;
      pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
    }
    const el = document.createElementNS(NS, 'polygon');
    el.setAttribute('points', pts.join(' '));
    parent.appendChild(el);
  }

  function appendCrescent(parent, cx, cy, r) {
    // Proper crescent: outer circle minus offset inner circle, using arc intersection math.
    // Inner circle is offset rightward so its edge intersects the outer circle at two points —
    // those intersection points become the crescent tips.
    const ri = r * 0.85;        // inner circle radius
    const dx = r * 0.3;         // rightward offset of inner circle center

    // Intersection x/y relative to outer circle center
    const ix = (dx * dx + r * r - ri * ri) / (2 * dx);
    const iy = Math.sqrt(Math.max(0, r * r - ix * ix));

    // Outer arc: large, counter-clockwise (sweep=0) → traces the left (crescent) side
    // Inner arc: large, clockwise (sweep=1)          → traces back via left side of inner circle
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', [
      `M ${cx + ix} ${cy - iy}`,
      `A ${r}  ${r}  0 1 0 ${cx + ix} ${cy + iy}`,
      `A ${ri} ${ri} 0 1 1 ${cx + ix} ${cy - iy}`,
      'Z',
    ].join(' '));
    parent.appendChild(path);
  }

  function appendEclipse(parent, cx, cy, r) {
    const ri = r * 0.82;
    const ox = r * 0.38;
    const circ = (x, y, rad) =>
      `M ${x} ${y - rad} A ${rad} ${rad} 0 1 1 ${x - 0.01} ${y - rad}`;
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', `${circ(cx, cy, r)} ${circ(cx + ox, cy, ri)}`);
    path.setAttribute('fill-rule', 'evenodd');
    parent.appendChild(path);
  }

  function appendSun(parent, cx, cy, r, rays, color) {
    const circle = document.createElementNS(NS, 'circle');
    circle.setAttribute('cx', cx); circle.setAttribute('cy', cy); circle.setAttribute('r', r * 0.45);
    parent.appendChild(circle);
    for (let i = 0; i < rays; i++) {
      const a  = (Math.PI * 2 / rays) * i - Math.PI / 2;
      const x1 = cx + r * 0.62 * Math.cos(a), y1 = cy + r * 0.62 * Math.sin(a);
      const x2 = cx + r * Math.cos(a),         y2 = cy + r * Math.sin(a);
      const line = document.createElementNS(NS, 'line');
      line.setAttribute('x1', x1); line.setAttribute('y1', y1);
      line.setAttribute('x2', x2); line.setAttribute('y2', y2);
      line.setAttribute('stroke', color);
      line.setAttribute('stroke-width', '3');
      line.setAttribute('stroke-linecap', 'round');
      parent.appendChild(line);
    }
  }

  function appendCircle(parent, cx, cy, r) {
    const el = document.createElementNS(NS, 'circle');
    el.setAttribute('cx', cx); el.setAttribute('cy', cy); el.setAttribute('r', r);
    parent.appendChild(el);
  }

  function appendCrossSym(parent, cx, cy, size) {
    const t = size * 0.32;
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d',
      `M ${cx-t},${cy-size} h ${t*2} v ${size-t} h ${size-t} v ${t*2} h ${-(size-t)} v ${size-t} h ${-t*2} v ${-(size-t)} h ${-(size-t)} v ${-t*2} h ${size-t} Z`);
    parent.appendChild(path);
  }

  // ── Color pickers ─────────────────────────────────────────────────────────
  function colorsNeeded() {
    const { layout, stripeCount } = state;
    switch (layout) {
      case 'solid':        return 1;
      case 'diagonal':     return 2;
      case 'cross':        return 2;
      case 'triangle-left':return 3;
      case 'canton-solid': return 2;
      case 'canton-stripe':return stripeCount + 1;
      default:             return stripeCount;   // h-stripe, v-stripe
    }
  }

  function buildColorPickers() {
    const wrap = document.getElementById('fd-color-pickers');
    if (!wrap) return;
    wrap.innerHTML = '';
    const needed = colorsNeeded();
    for (let i = 0; i < needed; i++) {
      const label = document.createElement('label');
      label.className = 'color-picker-label';
      const input = document.createElement('input');
      input.type  = 'color';
      input.value = state.colors[i] || '#888888';
      const idx = i;
      input.addEventListener('input', e => { state.colors[idx] = e.target.value; render(); });
      const isCantonSlot = (layout => layout === 'canton-solid' && i === 1) ||
                           (layout => layout === 'canton-stripe' && i === state.stripeCount);
      label.appendChild(input);
      label.appendChild(document.createTextNode(
        (state.layout === 'canton-solid' && i === 1) || (state.layout === 'canton-stripe' && i === state.stripeCount)
          ? 'Canton' : `Color ${i + 1}`
      ));
      wrap.appendChild(label);
    }
  }

  function showStripeCount() {
    const sec = document.getElementById('fd-stripe-count-section');
    if (!sec) return;
    const show = ['h-stripe', 'v-stripe', 'canton-stripe'].includes(state.layout);
    sec.style.display = show ? '' : 'none';
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  function init() {
    // Layout buttons
    document.querySelectorAll('.layout-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.layout-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        state.layout = btn.dataset.layout;
        showStripeCount();
        buildColorPickers();
        render();
      });
    });

    // Stripe count chips — listen on click and fire change manually
    document.querySelectorAll('input[name="stripe-count"]').forEach(inp => {
      inp.addEventListener('change', () => {
        state.stripeCount = parseInt(inp.value);
        buildColorPickers();
        render();
      });
    });

    // Symbol buttons
    document.querySelectorAll('.symbol-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.symbol-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        state.symbol = btn.dataset.symbol;
        render();
      });
    });

    // Symbol color
    document.getElementById('fd-symbol-color')?.addEventListener('input', e => {
      state.symColor = e.target.value;
      render();
    });

    // Symbol position — listen directly on the label click so we don't
    // depend on programmatic change-event dispatch from game.js
    document.querySelectorAll('.radio-chip').forEach(chip => {
      const inp = chip.querySelector('input[name="sym-pos"]');
      if (!inp) return;
      chip.addEventListener('click', () => {
        // Update state immediately on click (before checked state settles)
        state.symPos = inp.value;
        // Visual: deselect siblings, select this one
        document.querySelectorAll('input[name="sym-pos"]').forEach(i => {
          i.closest('.radio-chip')?.classList.remove('selected');
        });
        chip.classList.add('selected');
        inp.checked = true;
        render();
      });
    });

    // Save / Reset
    document.getElementById('fd-save-btn')?.addEventListener('click', save);
    document.getElementById('fd-save-btn-top')?.addEventListener('click', save);
    document.getElementById('fd-reset-btn')?.addEventListener('click', reset);

    showStripeCount();
    buildColorPickers();
    render();
  }

  // ── Save ──────────────────────────────────────────────────────────────────
  function save() {
    const name  = document.getElementById('flag-country-name')?.value.trim() || 'My Country';
    const svgEl = document.getElementById('flag-svg');
    if (!svgEl) return;

    const svgData = new XMLSerializer().serializeToString(svgEl);
    const dataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));

    // Include symbol color in theme palette if a symbol is used
    const themeColors = [...state.colors];
    if (state.symbol !== 'none' && !themeColors.includes(state.symColor)) {
      themeColors.push(state.symColor);
    }

    const entry = { name, svgData, dataUrl, colors: themeColors, savedAt: Date.now() };
    localStorage.setItem('geoQuiz_customFlag', JSON.stringify(entry));

    ThemeEngine.applyFlagColors(themeColors, name);
    ThemeEngine.setBanner(null, name, dataUrl);   // show custom SVG on banner
    showToast(`🚩 "${name}" saved! Theme applied.`, 'success');
  }

  function reset() {
    state = { layout: 'h-stripe', stripeCount: 3, colors: ['#CE1126','#FFFFFF','#003087'],
              symbol: 'none', symColor: '#FFFFFF', symPos: 'center' };
    document.querySelectorAll('.layout-btn').forEach(b => b.classList.toggle('selected', b.dataset.layout === 'h-stripe'));
    document.querySelectorAll('.symbol-btn').forEach(b => b.classList.toggle('selected', b.dataset.symbol === 'none'));
    document.querySelectorAll('input[name="sym-pos"]').forEach(i => {
      const isCenter = i.value === 'center';
      i.checked = isCenter;
      i.closest('.radio-chip')?.classList.toggle('selected', isCenter);
    });
    buildColorPickers();
    render();
  }

  function loadSaved() {
    const raw = localStorage.getItem('geoQuiz_customFlag');
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }

  return { init, render, loadSaved, getState: () => state };
})();
