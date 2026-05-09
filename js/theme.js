/* ═══════════════════════════════ THEME ENGINE ════════════════════════════ */
const ThemeEngine = (() => {

  // ── Color math ────────────────────────────────────────────────────────────
  function hexToRgb(hex) {
    const h = hex.replace('#', '');
    return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r,g,b), min = Math.min(r,g,b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max) {
        case r: h = ((g-b)/d + (g<b?6:0)) / 6; break;
        case g: h = ((b-r)/d + 2) / 6; break;
        case b: h = ((r-g)/d + 4) / 6; break;
      }
    }
    return [h * 360, s, l];
  }

  function hslToHex(h, s, l) {
    h /= 360;
    const a = s * Math.min(l, 1-l);
    const f = n => { const k = (n + h*12) % 12; return l - a*Math.max(-1, Math.min(k-3, 9-k, 1)); };
    const x = v => Math.round(v*255).toString(16).padStart(2,'0');
    return `#${x(f(0))}${x(f(8))}${x(f(4))}`;
  }

  function colorDist(a, b) {
    const [r1,g1,b1] = hexToRgb(a), [r2,g2,b2] = hexToRgb(b);
    return Math.sqrt((r1-r2)**2 + (g1-g2)**2 + (b1-b2)**2);
  }

  function mostVivid(hexColors) {
    let best = hexColors[0], bestS = -1;
    for (const hex of hexColors) {
      const [r,g,b] = hexToRgb(hex);
      const [,s] = rgbToHsl(r,g,b);
      if (s > bestS) { bestS = s; best = hex; }
    }
    return best;
  }

  // ── Build CSS vars from flag colors ───────────────────────────────────────
  function buildFromFlagColors(flagColors) {
    const accent = mostVivid(flagColors);
    const [r,g,b] = hexToRgb(accent);
    const [h, s]  = rgbToHsl(r,g,b);

    const others  = flagColors.filter(c => c !== accent);
    const accent2 = others.length ? mostVivid(others) : hslToHex((h+40)%360, s*0.8, 0.55);

    return {
      '--bg':        hslToHex(h, Math.min(s*0.25, 0.12), 0.06),
      '--bg2':       hslToHex(h, Math.min(s*0.28, 0.14), 0.09),
      '--surface':   hslToHex(h, Math.min(s*0.30, 0.16), 0.13),
      '--surface2':  hslToHex(h, Math.min(s*0.32, 0.18), 0.17),
      '--surface3':  hslToHex(h, Math.min(s*0.35, 0.20), 0.22),
      '--border':    hslToHex(h, Math.min(s*0.30, 0.15), 0.20),
      '--accent':    accent,
      '--accent2':   accent2,
      '--text':      '#e8eaf2',
      '--text-muted':'#8890a8',
      '--text-dim':  '#555d75',
    };
  }

  function apply(vars) {
    const root = document.documentElement;
    for (const [p,v] of Object.entries(vars)) root.style.setProperty(p, v);
    localStorage.setItem('geoQuiz_theme', JSON.stringify(vars));
  }

  function applyFlagColors(colors, name) {
    apply(buildFromFlagColors(colors));
    localStorage.setItem('geoQuiz_themeName', name || 'Custom');
    updateGridActive();
  }

  function applyPreset(key) {
    const preset = FLAG_THEMES[key];
    if (!preset) return;
    applyFlagColors(preset.colors, preset.name);
    setBanner(preset.iso2, preset.name);
    updateGridActive(key);
  }

  function applyDefault() {
    const props = ['--bg','--bg2','--surface','--surface2','--surface3','--border',
                   '--accent','--accent2','--text','--text-muted','--text-dim'];
    props.forEach(p => document.documentElement.style.removeProperty(p));
    localStorage.removeItem('geoQuiz_theme');
    localStorage.setItem('geoQuiz_themeName', 'Default Dark');
    setBanner(null, null);
    updateGridActive('default');
  }

  function loadSaved() {
    const raw = localStorage.getItem('geoQuiz_theme');
    if (raw) { try { apply(JSON.parse(raw)); } catch {} }
    // Restore banner
    const bannerData = localStorage.getItem('geoQuiz_bannerData');
    if (bannerData) {
      try {
        const { iso2, name, customSrc } = JSON.parse(bannerData);
        setBanner(iso2, name, customSrc);
      } catch {}
    }
  }

  // ── Home page banner ──────────────────────────────────────────────────────
  function setBanner(iso2, name, customSrc) {
    const banner  = document.getElementById('theme-active-banner');
    const flagImg = document.getElementById('theme-banner-flag');
    const nameEl  = document.getElementById('theme-banner-name');
    if (!banner) return;

    if (!name) {
      banner.style.display = 'none';
      localStorage.removeItem('geoQuiz_bannerData');
      return;
    }

    if (flagImg) {
      if (customSrc) {
        flagImg.src = customSrc;
      } else if (iso2) {
        flagImg.src = `https://flagcdn.com/w80/${iso2}.png`;
      } else {
        flagImg.style.display = 'none';
      }
      if (iso2 || customSrc) flagImg.style.display = '';
    }
    if (nameEl) nameEl.textContent = name;
    banner.style.display = '';

    localStorage.setItem('geoQuiz_bannerData', JSON.stringify({ iso2, name, customSrc: customSrc || null }));
  }

  // ── Color extraction from flag image via Canvas ───────────────────────────
  async function extractColorsFromFlag(iso2) {
    return new Promise(resolve => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const W = 80, H = 54;
          const canvas = document.createElement('canvas');
          canvas.width = W; canvas.height = H;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, W, H);

          // Sample a 3×3 grid across the flag
          const pts = [
            [W*.15,H*.5],[W*.5,H*.15],[W*.85,H*.5],[W*.5,H*.85],
            [W*.5, H*.5],[W*.15,H*.2],[W*.85,H*.2],[W*.15,H*.8],[W*.85,H*.8],
          ];
          const raw = pts.map(([x,y]) => {
            const d = ctx.getImageData(Math.floor(x),Math.floor(y),1,1).data;
            return `#${d[0].toString(16).padStart(2,'0')}${d[1].toString(16).padStart(2,'0')}${d[2].toString(16).padStart(2,'0')}`;
          });

          // Deduplicate — keep colors that are >50 apart in RGB distance
          const unique = [];
          for (const c of raw) {
            if (!unique.some(u => colorDist(u, c) < 55)) unique.push(c);
          }
          resolve(unique.slice(0, 4));
        } catch {
          resolve(['#4f8ef7','#7b5cf6']);
        }
      };
      img.onerror = () => resolve(['#4f8ef7','#7b5cf6']);
      img.src = `https://flagcdn.com/w160/${iso2}.png`;
    });
  }

  // ── Theme grid ────────────────────────────────────────────────────────────
  function buildGrid() {
    const grid = document.getElementById('theme-grid');
    if (!grid) return;
    grid.innerHTML = '';

    // Default tile
    grid.appendChild(makeSwatchDefault());

    // Preset country themes — show actual flag images
    for (const [key, theme] of Object.entries(FLAG_THEMES)) {
      if (!theme) continue;
      grid.appendChild(makeSwatch(key, theme.name, theme.iso2));
    }

    // Custom flag tile if one has been saved
    const saved = localStorage.getItem('geoQuiz_customFlag');
    if (saved) {
      try {
        const flag = JSON.parse(saved);
        const tile = makeSwatchCustom(flag);
        grid.appendChild(tile);
      } catch {}
    }

    // Populate country dropdown
    buildCountryDropdown();
    updateGridActive();
  }

  function makeSwatchDefault() {
    const div = makeTile('default', 'Default Dark');
    const preview = document.createElement('div');
    preview.className = 'swatch-default-preview';
    preview.innerHTML = `<span style="color:#4f8ef7;font-size:1.5rem;font-weight:800">Geo</span><span style="color:#e8eaf2;font-size:1.5rem;font-weight:800">Quiz</span>`;
    div.insertBefore(preview, div.firstChild);
    div.addEventListener('click', applyDefault);
    return div;
  }

  function makeSwatch(key, name, iso2) {
    const div = makeTile(key, name);
    const wrap = document.createElement('div');
    wrap.className = 'swatch-flag-wrap';
    const img = document.createElement('img');
    img.className   = 'swatch-flag-img';
    img.src         = `https://flagcdn.com/w160/${iso2}.png`;
    img.alt         = name;
    img.loading     = 'lazy';
    img.onerror     = () => { img.style.display = 'none'; };
    wrap.appendChild(img);
    div.insertBefore(wrap, div.firstChild);
    div.addEventListener('click', () => applyPreset(key));
    return div;
  }

  function makeSwatchCustom(flag) {
    const div = makeTile('custom-flag', `🚩 ${flag.name}`);
    const wrap = document.createElement('div');
    wrap.className = 'swatch-flag-wrap';
    const img = document.createElement('img');
    img.className = 'swatch-flag-img';
    img.src       = flag.dataUrl || '';
    img.alt       = flag.name;
    wrap.appendChild(img);
    div.insertBefore(wrap, div.firstChild);
    div.addEventListener('click', () => {
      applyFlagColors(flag.colors, flag.name);
      setBanner(null, flag.name, flag.dataUrl);
    });
    return div;
  }

  function makeTile(key, label) {
    const div = document.createElement('div');
    div.className = 'theme-swatch';
    div.dataset.themeKey = key;
    const lbl = document.createElement('div');
    lbl.className   = 'swatch-label';
    lbl.textContent = label;
    div.appendChild(lbl);
    return div;
  }

  function updateGridActive(key) {
    const active = key ?? localStorage.getItem('geoQuiz_themeName') ?? 'Default Dark';
    document.querySelectorAll('.theme-swatch').forEach(el => el.classList.remove('active'));
    if (key === 'default' || active === 'Default Dark') {
      document.querySelector('.theme-swatch[data-theme-key="default"]')?.classList.add('active');
    } else {
      document.querySelector(`.theme-swatch[data-theme-key="${key}"]`)?.classList.add('active');
    }
  }

  // ── Country dropdown ──────────────────────────────────────────────────────
  function buildCountryDropdown() {
    const sel = document.getElementById('theme-country-select');
    if (!sel) return;

    // Keep the placeholder option, then add all countries sorted by name
    sel.innerHTML = '<option value="">— choose a country —</option>';
    [...COUNTRY_LIST]
      .sort((a,b) => a.name.localeCompare(b.name))
      .forEach(c => {
        const opt = document.createElement('option');
        opt.value       = c.iso2;
        opt.textContent = c.name;
        sel.appendChild(opt);
      });

    sel.addEventListener('change', () => {
      const iso2    = sel.value;
      const preview = document.getElementById('picker-preview');
      const flagImg = document.getElementById('picker-flag');
      if (!iso2) { if (preview) preview.style.display = 'none'; return; }
      if (flagImg) { flagImg.src = `https://flagcdn.com/w160/${iso2}.png`; flagImg.alt = iso2; }
      if (preview) preview.style.display = '';
    });

    document.getElementById('theme-apply-country')?.addEventListener('click', async () => {
      const iso2 = document.getElementById('theme-country-select')?.value;
      if (!iso2) return;
      const countryEntry = COUNTRY_LIST.find(c => c.iso2 === iso2);
      const name  = countryEntry?.name ?? iso2.toUpperCase();
      const colors = await extractColorsFromFlag(iso2);
      applyFlagColors(colors, name);
      setBanner(iso2, name);
      showToast(`🌍 ${name} theme applied`, 'success');
      updateGridActive();
    });
  }

  // ── Toast (shared helper) ─────────────────────────────────────────────────
  function showToast(msg, type) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.className   = `toast show ${type || ''}`;
    clearTimeout(t._timer);
    t._timer = setTimeout(() => { t.className = 'toast'; }, 2800);
  }

  return { applyFlagColors, applyPreset, applyDefault, loadSaved, buildGrid, setBanner };
})();
