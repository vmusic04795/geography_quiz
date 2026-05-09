/* ═══════════════════════════════ BORDERS MODE ════════════════════════════ */
const BordersMode = (() => {
  let settings = { regions: ['Africa','Americas','Asia','Europe','Oceania'], maxRounds: 5 };
  let current = null;   // { code, data }
  let found   = new Set();
  let score   = 0;
  let round   = 1;

  function readSettings() {
    settings.regions = Array.from(document.querySelectorAll('input[name="borders-region"]:checked')).map(e => e.value);
    if (!settings.regions.length) settings.regions = ['Africa','Americas','Asia','Europe','Oceania'];
    settings.maxRounds = parseInt(document.getElementById('borders-rounds-slider')?.value ?? '5', 10);
  }

  function flagUrl(iso2) {
    return `https://flagcdn.com/w160/${iso2}.png`;
  }

  // ── Start / New Round ─────────────────────────────────────────────────────
  function newRound() {
    const pool = BORDERED_COUNTRIES.filter(c => settings.regions.includes(COUNTRIES[c].region));
    const safePool = pool.length ? pool : BORDERED_COUNTRIES;
    const code = safePool[Math.floor(Math.random() * safePool.length)];
    current = { code, data: COUNTRIES[code] };
    found = new Set();

    // Hide reveal section
    const reveal = document.getElementById('borders-reveal');
    if (reveal) reveal.style.display = 'none';

    // Update UI
    document.getElementById('borders-country-name').textContent = current.data.name;
    document.getElementById('borders-round').textContent = round;
    document.getElementById('borders-score').textContent = score;
    document.getElementById('borders-found-count').textContent = '0';
    document.getElementById('borders-total-count').textContent = current.data.borders.length;
    document.getElementById('borders-hint').textContent =
      `${current.data.borders.length} border${current.data.borders.length !== 1 ? 's' : ''}`;

    const flagEl = document.getElementById('borders-flag');
    flagEl.src = flagUrl(current.data.iso2);
    flagEl.style.display = '';
    flagEl.alt = current.data.name;

    document.getElementById('borders-found-chips').innerHTML = '';
    document.getElementById('borders-input').value = '';
    document.getElementById('borders-input').focus();
    document.getElementById('borders-autocomplete').innerHTML = '';
    document.getElementById('borders-autocomplete').classList.remove('open');

    document.getElementById('borders-round').textContent = round;
    document.getElementById('borders-round-total').textContent = settings.maxRounds;

    document.getElementById('borders-end').style.display = 'none';
    document.getElementById('borders-question-card').style.display = '';
    document.querySelectorAll('#screen-borders .input-row, #screen-borders .found-list-wrap').forEach(el => el.style.display = '');
  }

  function start() {
    readSettings();
    score = 0;
    round = 1;
    newRound();
  }

  // ── Submit a guess ────────────────────────────────────────────────────────
  function submitGuess(input) {
    const trimmed = input.trim();
    if (!trimmed) return;

    const code = findCountryByName(trimmed);
    if (!code) {
      showToast('Country not found — check spelling', 'error');
      document.getElementById('borders-input').value = '';
      closeAutocomplete('borders-autocomplete');
      return;
    }
    if (found.has(code)) {
      showToast('Already found!');
      document.getElementById('borders-input').value = '';
      closeAutocomplete('borders-autocomplete');
      return;
    }
    if (!current.data.borders.includes(code)) {
      showToast(`${COUNTRIES[code].name} does not border ${current.data.name}`, 'error');
      document.getElementById('borders-input').value = '';
      closeAutocomplete('borders-autocomplete');
      return;
    }

    found.add(code);
    const pts = 10 + (round - 1) * 2;
    score += pts;
    document.getElementById('borders-score').textContent = score;
    document.getElementById('borders-found-count').textContent = found.size;

    addChip('borders-found-chips', COUNTRIES[code].name, 'chip-found');
    showToast(`✓ ${COUNTRIES[code].name} +${pts}`, 'success');

    document.getElementById('borders-input').value = '';
    closeAutocomplete('borders-autocomplete');

    if (found.size === current.data.borders.length) {
      showToast('🎉 All borders found!', 'success');
      setTimeout(revealAndAdvance, 1200);
    }
  }

  function giveUp() {
    revealAndAdvance(true);
  }

  function revealAndAdvance(showMissed = true) {
    const missed = current.data.borders.filter(c => !found.has(c));
    const reveal = document.getElementById('borders-reveal');
    const missedChips = document.getElementById('borders-missed-chips');

    if (missed.length > 0 && showMissed) {
      missedChips.innerHTML = '';
      missed.forEach(c => addChip('borders-missed-chips', COUNTRIES[c]?.name ?? c, 'chip-missed'));
      reveal.style.display = '';
    } else {
      reveal.style.display = 'none';
      nextRound();
    }
  }

  function nextRound() {
    round++;
    if (round > settings.maxRounds) { endGame(); return; }
    newRound();
  }

  function endGame() {
    saveHighScore('borders', score);
    document.getElementById('borders-final-score').textContent = score;
    document.getElementById('borders-question-card').style.display = 'none';
    document.querySelectorAll('#screen-borders .input-row, #screen-borders .found-list-wrap, #borders-reveal').forEach(el => el.style.display = 'none');
    document.getElementById('borders-end').style.display = '';
  }

  // ── Autocomplete ──────────────────────────────────────────────────────────
  function handleInput(val) {
    const suggestions = autocomplete(val, 6);
    const list = document.getElementById('borders-autocomplete');
    list.innerHTML = '';
    if (!suggestions.length || !val.trim()) {
      list.classList.remove('open');
      return;
    }
    suggestions.forEach(s => {
      const item = document.createElement('div');
      item.className = 'autocomplete-item';
      item.textContent = s.name;
      item.addEventListener('mousedown', e => {
        e.preventDefault();
        submitGuess(s.name);
      });
      list.appendChild(item);
    });
    list.classList.add('open');
  }

  // ── DOM wiring ────────────────────────────────────────────────────────────
  function init() {
    const slider = document.getElementById('borders-rounds-slider');
    if (slider) slider.addEventListener('input', () => {
      document.getElementById('borders-rounds-display').textContent = slider.value;
    });

    const input = document.getElementById('borders-input');
    input.addEventListener('input', e => handleInput(e.target.value));
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        submitGuess(input.value);
        closeAutocomplete('borders-autocomplete');
      }
      if (e.key === 'Escape') closeAutocomplete('borders-autocomplete');
    });
    input.addEventListener('blur', () => setTimeout(() => closeAutocomplete('borders-autocomplete'), 150));

    document.getElementById('borders-give-up').addEventListener('click', giveUp);
    document.getElementById('borders-next').addEventListener('click', nextRound);
    document.getElementById('borders-play-again').addEventListener('click', () => start());
    document.getElementById('borders-change-settings').addEventListener('click', () => Game.showScreen('screen-borders-setup'));
  }

  return { init, start };
})();

// ── Shared helpers ─────────────────────────────────────────────────────────
function addChip(containerId, text, cls) {
  const wrap = document.getElementById(containerId);
  if (!wrap) return;
  const chip = document.createElement('span');
  chip.className = `chip ${cls}`;
  chip.textContent = text;
  wrap.appendChild(chip);
}

function closeAutocomplete(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.remove('open'); el.innerHTML = ''; }
}

function showToast(msg, type) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = `toast show ${type || ''}`;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.className = 'toast'; }, 2600);
}
