/* ══════════════════════════════ PATHFINDER MODE ══════════════════════════ */
const PathfinderMode = (() => {
  const DIFFICULTY_HOPS = {
    easy:      [2, 4],
    normal:    [3, 7],
    challenge: [5, 10],
  };

  let settings = { difficulty: 'normal', maxRounds: 5 };
  let game = null;
  let score = 0;
  let hintsUsed = 0;
  let journeysDone = 0;

  function readSettings() {
    settings.difficulty = document.querySelector('input[name="pathfinder-difficulty"]:checked')?.value ?? 'normal';
    settings.maxRounds = parseInt(document.getElementById('pathfinder-rounds-slider')?.value ?? '5', 10);
  }

  function flagUrl(iso2) { return `https://flagcdn.com/w160/${iso2}.png`; }

  // ── Start / New Journey ───────────────────────────────────────────────────
  function newJourney() {
    const [minH, maxH] = DIFFICULTY_HOPS[settings.difficulty] ?? [3, 7];
    const pair = randomPathPair(minH, maxH);
    if (!pair) { showToast('Could not find a valid route — trying again', 'error'); newJourney(); return; }

    game = {
      start:       pair.start,
      end:         pair.end,
      optimalPath: pair.optimalPath,
      optimalHops: pair.optimalHops,
      current:     pair.start,
      path:        [pair.start],
      moves:       0,
    };
    hintsUsed = 0;

    document.getElementById('path-start').textContent       = COUNTRIES[game.start].name;
    document.getElementById('path-end').textContent         = COUNTRIES[game.end].name;
    document.getElementById('path-start-flag').src          = flagUrl(COUNTRIES[game.start].iso2);
    document.getElementById('path-end-flag').src            = flagUrl(COUNTRIES[game.end].iso2);
    document.getElementById('pathfinder-score').textContent         = score;
    document.getElementById('pathfinder-moves').textContent         = 0;
    document.getElementById('pathfinder-best').textContent          = game.optimalHops;
    document.getElementById('pathfinder-journey').textContent       = journeysDone + 1;
    document.getElementById('pathfinder-journey-total').textContent = settings.maxRounds;

    document.getElementById('pathfinder-end').style.display     = 'none';
    document.getElementById('pathfinder-success').style.display = 'none';
    document.getElementById('pathfinder-hint-reveal').style.display = 'none';
    document.getElementById('pathfinder-input').value = '';

    renderTrail();
    updatePrompt();
    document.getElementById('pathfinder-input').focus();
  }

  function start() {
    readSettings();
    score = 0;
    journeysDone = 0;
    newJourney();
  }

  // ── Render the trail ──────────────────────────────────────────────────────
  function renderTrail() {
    const trail = document.getElementById('path-trail');
    if (!trail) return;
    trail.innerHTML = '';
    game.path.forEach((code, i) => {
      if (i > 0) {
        const arr = document.createElement('span');
        arr.className = 'trail-arrow';
        arr.textContent = '→';
        trail.appendChild(arr);
      }
      const node = document.createElement('span');
      const isStart   = i === 0;
      const isEnd     = code === game.end;
      const isCurrent = i === game.path.length - 1 && !isEnd;
      node.className = `trail-node${isStart ? ' start' : ''}${isEnd ? ' end' : ''}${isCurrent ? ' current' : ''}`;
      node.textContent = COUNTRIES[code]?.name ?? code;
      trail.appendChild(node);
    });
  }

  function updatePrompt() {
    const label = document.getElementById('path-current-label');
    if (label) label.textContent = COUNTRIES[game.current]?.name ?? game.current;
    document.getElementById('pathfinder-moves').textContent = game.moves;
  }

  // ── Submit a move ─────────────────────────────────────────────────────────
  function submitMove(input) {
    const trimmed = input.trim();
    if (!trimmed) return;

    const inp = document.getElementById('pathfinder-input');
    const code = findCountryByName(trimmed);
    if (!code) { showToast('Country not found — check spelling', 'error'); inp.value = ''; closeAutocomplete('pathfinder-autocomplete'); return; }

    const neighbors = getNeighbors(game.current);
    if (!neighbors.includes(code)) {
      showToast(`${COUNTRIES[code].name} does not border ${COUNTRIES[game.current].name}`, 'error');
      inp.value = '';
      closeAutocomplete('pathfinder-autocomplete');
      return;
    }
    if (game.path.includes(code) && code !== game.end) {
      showToast("You've already been there — find a new route", 'error');
      inp.value = '';
      closeAutocomplete('pathfinder-autocomplete');
      return;
    }

    game.path.push(code);
    game.current = code;
    game.moves++;
    document.getElementById('pathfinder-input').value = '';
    closeAutocomplete('pathfinder-autocomplete');

    renderTrail();
    updatePrompt();

    if (code === game.end) {
      onSuccess();
    }
  }

  function onSuccess() {
    const extra  = game.moves - game.optimalHops;
    const hintPenalty = hintsUsed * 5;
    let pts = Math.max(0, 100 - extra * 15 - hintPenalty);
    score += pts;

    document.getElementById('pathfinder-score').textContent = score;

    const final = document.getElementById('path-trail-final');
    if (final) {
      final.innerHTML = document.getElementById('path-trail').innerHTML;
    }

    let msg = `You took ${game.moves} hop${game.moves !== 1 ? 's' : ''}. `;
    msg += game.moves === game.optimalHops
      ? `🏆 Optimal! +${pts} points`
      : `Optimal was ${game.optimalHops}. +${pts} points`;
    if (hintPenalty) msg += ` (−${hintPenalty} hint penalty)`;

    document.getElementById('pathfinder-success-msg').textContent = msg;
    document.getElementById('pathfinder-success').style.display = '';

    journeysDone++;
    saveHighScore('pathfinder', score);

    if (journeysDone >= settings.maxRounds) {
      setTimeout(endGame, 1800);
    }
  }

  function endGame() {
    document.getElementById('pathfinder-success').style.display = 'none';
    document.getElementById('pathfinder-final-score').textContent = score;
    document.getElementById('pathfinder-end').style.display = '';
  }

  // ── Hint ──────────────────────────────────────────────────────────────────
  function showHint() {
    const subPath = findShortestPath(game.current, game.end);
    if (!subPath || subPath.length < 2) { showToast('You are at the destination!'); return; }

    hintsUsed++;
    const nextCode = subPath[1];
    const hintEl = document.getElementById('pathfinder-hint-reveal');
    hintEl.textContent = `💡 Hint: Head towards ${COUNTRIES[nextCode].name} (−5 pts penalty)`;
    hintEl.style.display = '';
  }

  // ── Autocomplete ──────────────────────────────────────────────────────────
  function handleInput(val) {
    const suggestions = autocomplete(val, 6);
    const list = document.getElementById('pathfinder-autocomplete');
    list.innerHTML = '';
    if (!suggestions.length || !val.trim()) { list.classList.remove('open'); return; }

    suggestions.forEach(s => {
      const item = document.createElement('div');
      item.className = 'autocomplete-item';
      item.textContent = s.name;
      item.addEventListener('mousedown', e => { e.preventDefault(); submitMove(s.name); });
      list.appendChild(item);
    });
    list.classList.add('open');
  }

  // ── DOM wiring ────────────────────────────────────────────────────────────
  function init() {
    document.querySelectorAll('input[name="pathfinder-difficulty"]').forEach(inp => {
      inp.addEventListener('change', () => {
        document.querySelectorAll('label[data-value]').forEach(l => {
          if (['easy','normal','challenge'].includes(l.dataset.value))
            l.classList.toggle('selected', l.dataset.value === inp.value);
        });
      });
    });

    const input = document.getElementById('pathfinder-input');
    input.addEventListener('input', e => handleInput(e.target.value));
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') { submitMove(input.value); closeAutocomplete('pathfinder-autocomplete'); }
      if (e.key === 'Escape') closeAutocomplete('pathfinder-autocomplete');
    });
    input.addEventListener('blur', () => setTimeout(() => closeAutocomplete('pathfinder-autocomplete'), 150));

    document.getElementById('pathfinder-hint-btn').addEventListener('click', showHint);
    document.getElementById('pathfinder-next').addEventListener('click', () => {
      if (journeysDone >= settings.maxRounds) { endGame(); return; }
      newJourney();
    });
    document.getElementById('pathfinder-play-again').addEventListener('click', () => start());
    document.getElementById('pathfinder-change-settings').addEventListener('click', () => Game.showScreen('screen-pathfinder-setup'));

    const slider = document.getElementById('pathfinder-rounds-slider');
    if (slider) slider.addEventListener('input', () => {
      document.getElementById('pathfinder-rounds-display').textContent = slider.value;
    });
  }

  return { init, start };
})();
