/* ════════════════════════════ SHAPE RENDERER ═════════════════════════════
   Uses D3 + world-atlas (both free, CDN-hosted).
   Loads TopoJSON once, caches it, renders per-country SVG silhouettes.
   Falls back to flag image if a country is too small for the 110m dataset.
═════════════════════════════════════════════════════════════════════════════*/
const ShapeRenderer = (() => {

  let worldData    = null;
  let loadPromise  = null;

  // ISO alpha-3 → numeric ISO 3166-1 (used as IDs in world-atlas)
  const ISO_NUM = {
    AFG:4,   ALB:8,   DZA:12,  AND:20,  AGO:24,  ATG:28,  ARG:32,  ARM:51,
    AUS:36,  AUT:40,  AZE:31,  BHS:44,  BHR:48,  BGD:50,  BRB:52,  BLR:112,
    BEL:56,  BLZ:84,  BEN:204, BTN:64,  BOL:68,  BIH:70,  BWA:72,  BRA:76,
    BRN:96,  BGR:100, BFA:854, BDI:108, CPV:132, KHM:116, CMR:120, CAN:124,
    CAF:140, TCD:148, CHL:152, CHN:156, COL:170, COM:174, COD:180, COG:178,
    CRI:188, HRV:191, CUB:192, CYP:196, CZE:203, DNK:208, DJI:262, DMA:212,
    DOM:214, ECU:218, EGY:818, SLV:222, GNQ:226, ERI:232, EST:233, SWZ:748,
    ETH:231, FJI:242, FIN:246, FRA:250, GAB:266, GMB:270, GEO:268, DEU:276,
    GHA:288, GRC:300, GRD:308, GTM:320, GIN:324, GNB:624, GUY:328, HTI:332,
    VAT:336, HND:340, HUN:348, ISL:352, IND:356, IDN:360, IRN:364, IRQ:368,
    IRL:372, ISR:376, ITA:380, JAM:388, JPN:392, JOR:400, KAZ:398, KEN:404,
    KIR:296, PRK:408, KOR:410, KWT:414, KGZ:417, LAO:418, LVA:428, LBN:422,
    LSO:426, LBR:430, LBY:434, LIE:438, LTU:440, LUX:442, MDG:450, MWI:454,
    MYS:458, MDV:462, MLI:466, MLT:470, MHL:584, MRT:478, MUS:480, MEX:484,
    FSM:583, MDA:498, MCO:492, MNG:496, MNE:499, MAR:504, MOZ:508, MMR:104,
    NAM:516, NRU:520, NPL:524, NLD:528, NZL:554, NIC:558, NER:562, NGA:566,
    NOR:578, OMN:512, PAK:586, PLW:585, PSE:275, PAN:591, PNG:598, PRY:600,
    PER:604, PHL:608, POL:616, PRT:620, QAT:634, ROU:642, RUS:643, RWA:646,
    KNA:659, LCA:662, VCT:670, WSM:882, SMR:674, STP:678, SAU:682, SEN:686,
    SRB:688, SYC:690, SLE:694, SGP:702, SVK:703, SVN:705, SLB:90,  SOM:706,
    ZAF:710, SSD:728, ESP:724, LKA:144, SDN:729, SUR:740, SWE:752, CHE:756,
    SYR:760, TJK:762, TZA:834, THA:764, TLS:626, TGO:768, TON:776, TTO:780,
    TUN:788, TUR:792, TKM:795, TUV:798, UGA:800, UKR:804, ARE:784, GBR:826,
    USA:840, URY:858, UZB:860, VUT:548, VEN:862, VNM:704, ESH:732, YEM:887,
    ZMB:894, ZWE:716,
  };

  // Countries too small for the 110m dataset — excluded from shape questions
  const TOO_SMALL = new Set([
    'MCO','SMR','VAT','LIE','AND',        // European microstates
    'NRU','TUV','PLW','MHL','FSM','KIR',  // Pacific micro-islands
    'MDV','STP','COM','SYC',              // tiny island nations
    'SGP','BHR','ATG','DMA','GRD',
    'KNA','LCA','VCT','BRB',
  ]);

  // ── Data loading ──────────────────────────────────────────────────────────
  function load() {
    if (loadPromise) return loadPromise;
    loadPromise = fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json')
      .then(r => { if (!r.ok) throw new Error('fetch failed'); return r.json(); })
      .then(data => { worldData = data; return data; })
      .catch(err => { loadPromise = null; throw err; });
    return loadPromise;
  }

  function getFeature(alpha3) {
    if (!worldData) return null;
    const num = ISO_NUM[alpha3];
    if (num === undefined) return null;
    const features = topojson.feature(worldData, worldData.objects.countries).features;
    return features.find(f => +f.id === num) ?? null;
  }

  // ── Render into a container element ──────────────────────────────────────
  async function render(container, alpha3) {
    container.innerHTML = '';

    // Spinner while loading
    const spinner = document.createElement('div');
    spinner.className = 'shape-spinner';
    spinner.textContent = '…';
    container.appendChild(spinner);

    try {
      await load();
    } catch {
      renderFallback(container, alpha3, 'Offline — shape unavailable');
      return;
    }

    const feature = getFeature(alpha3);
    if (!feature) {
      renderFallback(container, alpha3);
      return;
    }

    container.innerHTML = '';

    const W = 200, H = 140;
    const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgEl.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svgEl.style.cssText = 'width:200px;height:140px;overflow:visible';

    // Fit the projection to the bounding box of this country with padding
    const projection = d3.geoMercator().fitExtent([[6, 6], [W - 6, H - 6]], feature);
    const pathGen    = d3.geoPath().projection(projection);
    const dStr       = pathGen(feature);

    if (!dStr) { renderFallback(container, alpha3); return; }

    // Drop-shadow filter
    const defs   = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'shape-glow');
    const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    feGaussianBlur.setAttribute('stdDeviation', '3');
    feGaussianBlur.setAttribute('result', 'blur');
    filter.appendChild(feGaussianBlur);
    defs.appendChild(filter);
    svgEl.appendChild(defs);

    // Glow copy (blurred)
    const glow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    glow.setAttribute('d', dStr);
    glow.setAttribute('fill', 'var(--accent)');
    glow.setAttribute('fill-opacity', '0.35');
    glow.setAttribute('filter', 'url(#shape-glow)');
    svgEl.appendChild(glow);

    // Main shape
    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathEl.setAttribute('d', dStr);
    pathEl.setAttribute('fill', 'var(--accent)');
    pathEl.setAttribute('fill-opacity', '0.9');
    pathEl.setAttribute('stroke', 'var(--accent2)');
    pathEl.setAttribute('stroke-width', '1');
    pathEl.setAttribute('stroke-linejoin', 'round');
    svgEl.appendChild(pathEl);

    container.appendChild(svgEl);
  }

  // Flag image fallback for tiny/missing countries
  function renderFallback(container, alpha3, title) {
    container.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:6px';

    const img = document.createElement('img');
    img.className = 'gauntlet-flag';
    img.src   = `https://flagcdn.com/w160/${COUNTRIES[alpha3]?.iso2 ?? 'un'}.png`;
    img.alt   = COUNTRIES[alpha3]?.name ?? alpha3;
    if (title) img.title = title;

    const note = document.createElement('span');
    note.style.cssText = 'font-size:0.72rem;color:var(--text-dim)';
    note.textContent = '(shape unavailable for this country)';

    wrap.appendChild(img);
    wrap.appendChild(note);
    container.appendChild(wrap);
  }

  // Used by Gauntlet to filter the pool for shape questions
  function hasShape(alpha3) {
    return !TOO_SMALL.has(alpha3) && alpha3 in ISO_NUM;
  }

  // Preload data in the background so shape questions feel instant
  function preload() { load().catch(() => {}); }

  return { render, hasShape, preload };
})();
