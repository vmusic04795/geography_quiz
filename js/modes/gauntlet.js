/* ══════════════════════════════ GAUNTLET MODE ════════════════════════════ */
const GauntletMode = (() => {
  let settings = {
    mode:        'hard',
    qTypes:      ['capital','country-from-capital','flag','shape'],
    qCount:      20,
    answerStyle: 'multiple-choice',
    regions:     ['Africa','Americas','Asia','Europe','Oceania'],
  };

  let session = null;

  // Question type definitions
  const Q_TYPE_LABELS = {
    'capital':              'Capital City',
    'country-from-capital': 'Name the Country',
    'flag':                 'Flag Quiz',
    'flag-identify':        'Flag Quiz',
    'shape':                'Country Shape',
  };

  function flagUrl(iso2) { return `https://flagcdn.com/w160/${iso2}.png`; }

  // ── Settings ──────────────────────────────────────────────────────────────
  function readSettings() {
    settings.qTypes = Array.from(document.querySelectorAll('input[name="q-type"]:checked'))
      .map(el => el.value);
    if (!settings.qTypes.length) settings.qTypes = ['capital'];

    settings.qCount      = parseInt(document.getElementById('gauntlet-q-count')?.value ?? 20);
    settings.answerStyle = document.querySelector('input[name="answer-style"]:checked')?.value ?? 'multiple-choice';
    settings.regions     = Array.from(document.querySelectorAll('input[name="region"]:checked')).map(el => el.value);
    if (!settings.regions.length) settings.regions = ['Africa','Americas','Asia','Europe','Oceania'];
  }

  // ── Question generation ───────────────────────────────────────────────────
  function poolForType(type) {
    let pool = COUNTRY_LIST.filter(c => settings.regions.includes(c.region));
    if (type === 'shape') pool = pool.filter(c => ShapeRenderer.hasShape(c.code));
    return pool;
  }

  function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function distractors(correctCode, correctAnswer, getAnswer, count = 3) {
    const pool = COUNTRY_LIST.filter(c => c.code !== correctCode);
    const used = new Set([correctAnswer]);
    const result = [];
    let attempts = 0;
    while (result.length < count && attempts < 200) {
      attempts++;
      const c = randomFrom(pool);
      const ans = getAnswer(c);
      if (ans && !used.has(ans)) { used.add(ans); result.push(ans); }
    }
    return result;
  }

  function buildQuestion(type, forceCountry) {
    const country = forceCountry ?? (() => {
      const pool = poolForType(type);
      return pool.length ? randomFrom(pool) : null;
    })();
    if (!country) return null;

    switch (type) {
      case 'capital': {
        const wrong = distractors(country.code, country.capital, c => c.capital);
        return {
          type, prompt: `What is the capital of ${country.name}?`,
          answer: country.capital,
          choices: shuffle([country.capital, ...wrong]),
          media: null,
          country,
        };
      }
      case 'country-from-capital': {
        const wrong = distractors(country.code, country.name, c => c.name);
        return {
          type, prompt: `${country.capital} is the capital of which country?`,
          answer: country.name,
          choices: shuffle([country.name, ...wrong]),
          media: null,
          country,
        };
      }
      case 'flag': {
        const wrong = distractors(country.code, country.name, c => c.name);
        return {
          type, prompt: 'Which country does this flag belong to?',
          answer: country.name,
          choices: shuffle([country.name, ...wrong]),
          media: { type: 'flag', src: flagUrl(country.iso2) },
          country,
        };
      }
      case 'shape': {
        const wrong = distractors(country.code, country.name, c => c.name);
        return {
          type, prompt: 'Which country has this shape?',
          answer: country.name,
          choices: shuffle([country.name, ...wrong]),
          media: { type: 'shape', code: country.code },
          country,
        };
      }
      case 'flag-identify': {
        // Given country name → pick the correct flag from 4 images
        const wrong = distractors(country.code, country.iso2, c => c.iso2);
        return {
          type, prompt: `Which flag belongs to ${country.name}?`,
          answer: country.iso2,
          choices: shuffle([country.iso2, ...wrong]),
          media: null,
          country,
          flagPicker: true,
        };
      }
    }
    return null;
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function generateQuestions() {
    const qs = [];
    const types = [...settings.qTypes];
    const usedPerType = {};
    for (let i = 0; i < settings.qCount; i++) {
      const type = types[i % types.length];
      if (!usedPerType[type]) usedPerType[type] = new Set();
      const fullPool  = poolForType(type);
      const freshPool = fullPool.filter(c => !usedPerType[type].has(c.code));
      const pool      = freshPool.length ? freshPool : (usedPerType[type] = new Set(), fullPool);
      const country   = randomFrom(pool);
      if (!country) continue;
      const q = buildQuestion(type, country);
      if (q) { usedPerType[type].add(country.code); qs.push(q); }
    }
    return shuffle(qs);
  }

  // ── Hard Mode / Ultimate shared question builder ──────────────────────────
  function buildFullGauntlet(types) {
    const countries = shuffle([...COUNTRY_LIST]);
    const questions = [];
    let typeIdx = 0;
    for (const country of countries) {
      for (let i = 0; i < types.length; i++) {
        const type = types[(typeIdx + i) % types.length];
        if (type === 'ocean' && !country.oceans.length) continue;
        if (type === 'shape' && !ShapeRenderer.hasShape(country.code)) continue;
        const q = buildQuestion(type, country);
        if (q) { questions.push(q); typeIdx++; break; }
      }
    }
    return questions;
  }

  function startHardMode() {
    settings.answerStyle = 'multiple-choice';
    const questions = buildFullGauntlet(['capital','country-from-capital','flag','shape']);
    session = { questions, index: 0, score: 0, streak: 0, maxStreak: 0, answers: [], isHardMode: true };

    document.getElementById('gauntlet-q-total').textContent = questions.length;
    document.getElementById('gauntlet-end').style.display   = 'none';
    document.getElementById('gauntlet-card').style.display  = '';
    document.getElementById('hard-mode-trophy').style.display = 'none';
    document.getElementById('screen-gauntlet').classList.remove('ultimate-active');
    document.getElementById('screen-gauntlet').classList.add('hard-mode-active');
    updateProgress();
    showQuestion();
  }

  function startUltimateGauntlet() {
    settings.answerStyle = 'type-in';
    // flag-identify replaces flag: shown country name → pick correct flag image
    const questions = buildFullGauntlet(['capital','country-from-capital','flag-identify','shape']);
    session = { questions, index: 0, score: 0, streak: 0, maxStreak: 0, answers: [], isHardMode: true, isUltimate: true, fuzzyCount: 0 };

    document.getElementById('gauntlet-q-total').textContent = questions.length;
    document.getElementById('gauntlet-end').style.display   = 'none';
    document.getElementById('gauntlet-card').style.display  = '';
    document.getElementById('hard-mode-trophy').style.display = 'none';
    document.getElementById('screen-gauntlet').classList.remove('hard-mode-active');
    document.getElementById('screen-gauntlet').classList.add('hard-mode-active', 'ultimate-active');
    updateProgress();
    showQuestion();
  }

  // ── Session ───────────────────────────────────────────────────────────────
  function start() {
    document.getElementById('screen-gauntlet').classList.remove('hard-mode-active');
    readSettings();
    const questions = generateQuestions();
    session = {
      questions,
      index:     0,
      score:     0,
      streak:    0,
      maxStreak: 0,
      answers:   [],
    };

    document.getElementById('gauntlet-q-total').textContent = questions.length;
    document.getElementById('gauntlet-end').style.display   = 'none';
    document.getElementById('gauntlet-card').style.display  = '';
    updateProgress();
    showQuestion();
  }

  // ── Display question ──────────────────────────────────────────────────────
  function showQuestion() {
    const q = session.questions[session.index];
    if (!q) { endSession(); return; }

    document.getElementById('gauntlet-q-num').textContent  = session.index + 1;
    document.getElementById('gauntlet-q-type').textContent = Q_TYPE_LABELS[q.type] ?? q.type;
    document.getElementById('gauntlet-prompt').textContent = q.prompt;
    document.getElementById('gauntlet-feedback').style.display = 'none';
    document.getElementById('gauntlet-score').textContent  = session.score;
    document.getElementById('gauntlet-streak').textContent = session.streak;

    // Media
    const media = document.getElementById('gauntlet-media');
    media.innerHTML = '';
    if (q.media?.type === 'flag') {
      const img = document.createElement('img');
      img.className = 'gauntlet-flag';
      img.src = q.media.src;
      img.alt = 'Flag';
      media.appendChild(img);
    } else if (q.media?.type === 'shape') {
      renderShape(media, q.media.code);
    }

    // Choices vs type-in
    const choicesEl = document.getElementById('gauntlet-choices');
    const typeRow   = document.getElementById('gauntlet-type-row');
    const inputEl   = document.getElementById('gauntlet-input');

    const useTypeIn    = settings.answerStyle === 'type-in' && !q.flagPicker;
    const useFlagPicker = q.flagPicker;

    choicesEl.innerHTML = '';
    if (useFlagPicker) {
      // Flag image picker (Ultimate: identify the correct flag)
      choicesEl.style.display = '';
      typeRow.style.display   = 'none';
      choicesEl.className = 'classic-flag-choices';
      q.choices.forEach(iso2 => {
        const btn = document.createElement('button');
        btn.className    = 'flag-choice-btn';
        btn.dataset.iso2 = iso2;
        const img = document.createElement('img');
        img.src = flagUrl(iso2);
        img.alt = iso2;
        btn.appendChild(img);
        btn.addEventListener('click', () => selectChoice(iso2, q));
        choicesEl.appendChild(btn);
      });
    } else if (!useTypeIn && q.choices?.length) {
      choicesEl.style.display = '';
      typeRow.style.display   = 'none';
      choicesEl.className = 'gauntlet-choices';
      q.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className   = 'choice-btn';
        btn.textContent = choice;
        btn.addEventListener('click', () => selectChoice(choice, q));
        choicesEl.appendChild(btn);
      });
    } else {
      choicesEl.style.display = 'none';
      choicesEl.className     = 'gauntlet-choices';
      typeRow.style.display   = '';
      inputEl.value           = '';
      inputEl.focus();
      closeAutocomplete('gauntlet-autocomplete');
    }

    updateProgress();
  }

  // ── Shape rendering via D3 + world-atlas ─────────────────────────────────
  function renderShape(container, code) {
    ShapeRenderer.render(container, code); // async, fills container when ready
  }

  // ── Answer selection ──────────────────────────────────────────────────────
  function selectChoice(choice, q) {
    const correct = choice === q.answer;
    if (q.flagPicker) {
      document.querySelectorAll('.flag-choice-btn').forEach(btn => {
        btn.disabled = true;
        if (btn.dataset.iso2 === q.answer) btn.classList.add('correct');
        if (btn.dataset.iso2 === choice && !correct) btn.classList.add('wrong');
      });
    } else {
      document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === q.answer) btn.classList.add('correct');
        if (btn.textContent === choice && !correct) btn.classList.add('wrong');
      });
    }
    registerAnswer(correct, q);
  }

  // ── Fuzzy matching (Ultimate only) ───────────────────────────────────────
  function levenshtein(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, (_, i) =>
      Array.from({ length: n + 1 }, (_, j) => i === 0 ? j : j === 0 ? i : 0)
    );
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = a[i-1] === b[j-1]
          ? dp[i-1][j-1]
          : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
      }
    }
    return dp[m][n];
  }

  function fuzzyMatch(input, answer) {
    const a = input.trim().toLowerCase();
    const b = answer.trim().toLowerCase();
    if (a === b) return { match: true, fuzzy: false };
    // Tolerance: 0 for very short words, ~20% of length otherwise
    const maxErr = b.length <= 4 ? 0 : Math.floor(b.length * 0.2);
    const dist   = levenshtein(a, b);
    return { match: dist <= maxErr, fuzzy: dist > 0 && dist <= maxErr };
  }

  function submitTyped() {
    const q   = session.questions[session.index];
    const inp = document.getElementById('gauntlet-input');
    const val = inp.value.trim();
    if (!val) return;

    let correct = false, isFuzzy = false;
    if (session?.isUltimate) {
      const result = fuzzyMatch(val, q.answer);
      correct = result.match;
      isFuzzy = result.fuzzy;
    } else {
      const clean = val.toLowerCase();
      const ans   = q.answer.toLowerCase();
      correct = clean === ans || ans.includes(clean) || clean.includes(ans);
    }

    registerAnswer(correct, q, isFuzzy);
  }

  function registerAnswer(correct, q, isFuzzy) {
    if (correct) {
      session.streak++;
      session.maxStreak = Math.max(session.maxStreak, session.streak);
      const streakBonus = Math.min(session.streak - 1, 5) * 2;
      const base = isFuzzy ? 5 : 10;
      const pts  = base + streakBonus;
      session.score += pts;
      if (isFuzzy) session.fuzzyCount = (session.fuzzyCount ?? 0) + 1;
      const spelling = isFuzzy ? ` (${q.answer})` : '';
      showFeedback(true, `✓ Correct! +${pts}${streakBonus ? ` (streak ×${session.streak})` : ''}${spelling}`);
    } else {
      session.streak = 0;
      const answerLabel = q.flagPicker
        ? (COUNTRY_LIST.find(c => c.iso2 === q.answer)?.name ?? q.answer)
        : q.answer;
      showFeedback(false, `✗ The answer was: ${answerLabel}`);
    }
    session.answers.push({ correct, q });

    setTimeout(() => {
      session.index++;
      if (session.index >= session.questions.length) endSession();
      else showQuestion();
    }, correct ? 900 : 1600);
  }

  function showFeedback(correct, msg) {
    const el = document.getElementById('gauntlet-feedback');
    el.textContent = msg;
    el.className = `gauntlet-feedback ${correct ? 'correct' : 'wrong'}`;
    el.style.display = '';
    document.getElementById('gauntlet-score').textContent  = session.score;
    document.getElementById('gauntlet-streak').textContent = session.streak;
  }

  function updateProgress() {
    if (!session) return;
    const pct = (session.index / session.questions.length) * 100;
    document.getElementById('gauntlet-progress').style.width = pct + '%';
  }

  // ── End Session ───────────────────────────────────────────────────────────
  function endSession() {
    document.getElementById('gauntlet-card').style.display = 'none';
    document.getElementById('gauntlet-end').style.display  = '';
    document.getElementById('gauntlet-final-score').textContent = session.score;
    document.getElementById('gauntlet-progress').style.width = '100%';

    const total   = session.questions.length;
    const correct = session.answers.filter(a => a.correct).length;
    const pct     = Math.round((correct / total) * 100);

    if (session.isUltimate) {
      document.getElementById('gauntlet-end-title').textContent = 'Unstoppable.';
      const trophy = document.getElementById('hard-mode-trophy');
      if (trophy) {
        trophy.classList.add('ultimate-trophy');
        trophy.querySelector('.trophy-title').textContent = 'Ultimate Conquered';
        trophy.querySelector('.trophy-sub').textContent   = 'Every country. Every answer typed. Legendary.';
        trophy.style.display = '';
        trophy.classList.remove('trophy-reveal');
        void trophy.offsetWidth;
        trophy.classList.add('trophy-reveal');
      }
      launchConfetti();
      saveGauntletBadge(correct, total, true);
    } else if (session.isHardMode) {
      document.getElementById('gauntlet-end-title').textContent = 'You Did It.';
      const trophy = document.getElementById('hard-mode-trophy');
      if (trophy) {
        trophy.classList.remove('ultimate-trophy');
        trophy.querySelector('.trophy-title').textContent = 'Gauntlet Conquered';
        trophy.querySelector('.trophy-sub').textContent   = 'You survived every country on Earth.';
        trophy.style.display = '';
        trophy.classList.remove('trophy-reveal');
        void trophy.offsetWidth;
        trophy.classList.add('trophy-reveal');
      }
      launchConfetti();
      saveGauntletBadge(correct, total, false);
    } else {
      document.getElementById('gauntlet-end-title').textContent = 'Gauntlet Complete!';
    }

    let msg = `${correct}/${total} correct (${pct}%). `;
    if (pct === 100) msg += '🏆 Perfect score!';
    else if (pct >= 80) msg += '🌟 Excellent work!';
    else if (pct >= 60) msg += '👍 Good effort!';
    else if (pct >= 40) msg += '📚 Keep studying!';
    else msg += '🌍 There\'s a whole world to discover!';

    document.getElementById('gauntlet-final-msg').textContent = msg;
    saveHighScore('gauntlet', session.score, session.maxStreak);
  }

  function saveGauntletBadge(correct, total, isUltimate) {
    const key        = isUltimate ? 'geoQuiz_ultimateBeaten' : 'geoQuiz_hardModeBeaten';
    const prev       = JSON.parse(localStorage.getItem(key) || '{}');
    const thisPerfect = isUltimate && session.fuzzyCount === 0;
    const entry = {
      date:    new Date().toLocaleDateString(),
      score:   session.score,
      correct,
      total,
      perfect: thisPerfect || !!prev.perfect, // once earned, never lost
    };
    if (!prev.score || session.score > prev.score) {
      localStorage.setItem(key, JSON.stringify(entry));
    } else if (thisPerfect && !prev.perfect) {
      // New run wasn't a high score but first perfect — preserve best score, set flag
      localStorage.setItem(key, JSON.stringify({ ...prev, perfect: true }));
    }
    if (isUltimate && !localStorage.getItem('geoQuiz_hardModeBeaten')) {
      localStorage.setItem('geoQuiz_hardModeBeaten', JSON.stringify(entry));
    }
  }

  function launchConfetti() {
    const colors = ['#ffd700','#ff6b35','#4f8ef7','#7b5cf6','#3ecf8e','#f7b955','#ff4757','#ffffff'];
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden;';
    for (let i = 0; i < 90; i++) {
      const p   = document.createElement('div');
      const clr = colors[Math.floor(Math.random() * colors.length)];
      const sz  = 5 + Math.random() * 9;
      const delay   = Math.random() * 1.8;
      const dur     = 2.4 + Math.random() * 2.2;
      const left    = Math.random() * 100;
      const drift   = (Math.random() - 0.5) * 200;
      const radius  = Math.random() > 0.45 ? '50%' : '2px';
      p.style.cssText = `position:absolute;left:${left}%;top:-16px;width:${sz}px;height:${sz}px;` +
        `background:${clr};border-radius:${radius};` +
        `animation:confettiFall ${dur}s ${delay}s ease-in forwards;` +
        `--drift:${drift}px;`;
      wrap.appendChild(p);
    }
    document.body.appendChild(wrap);
    setTimeout(() => wrap.remove(), 6000);
  }

  // ── Autocomplete for type-in ──────────────────────────────────────────────
  function handleTypeInput(val) {
    if (session?.isUltimate) return; // Ultimate: no autocomplete, spell it yourself
    const q = session?.questions[session.index];
    if (!q) return;

    const suggestions = autocomplete(val, 5).map(s => s.name);

    const list = document.getElementById('gauntlet-autocomplete');
    list.innerHTML = '';
    if (!suggestions.length || !val.trim()) { list.classList.remove('open'); return; }
    suggestions.forEach(s => {
      const item = document.createElement('div');
      item.className = 'autocomplete-item';
      item.textContent = s;
      item.addEventListener('mousedown', e => {
        e.preventDefault();
        document.getElementById('gauntlet-input').value = s;
        closeAutocomplete('gauntlet-autocomplete');
        submitTyped();
      });
      list.appendChild(item);
    });
    list.classList.add('open');
  }

  // ── DOM wiring ────────────────────────────────────────────────────────────
  function init() {
    // Slider
    const slider = document.getElementById('gauntlet-q-count');
    const label  = document.getElementById('gauntlet-q-count-label');
    if (slider && label) {
      slider.addEventListener('input', () => { label.textContent = `${slider.value} questions`; });
    }

    // Answer style radios
    document.querySelectorAll('input[name="answer-style"]').forEach(inp => {
      inp.addEventListener('change', () => {
        document.querySelectorAll('label[data-value]').forEach(l => {
          if (['multiple-choice','type-in'].includes(l.dataset.value)) {
            l.classList.toggle('selected', l.dataset.value === inp.value);
          }
        });
      });
    });

    // Type-in input
    const gauntletInput = document.getElementById('gauntlet-input');
    gauntletInput?.addEventListener('input', e => handleTypeInput(e.target.value));
    gauntletInput?.addEventListener('keydown', e => {
      if (e.key === 'Enter') { submitTyped(); closeAutocomplete('gauntlet-autocomplete'); }
    });
    gauntletInput?.addEventListener('blur', () => setTimeout(() => closeAutocomplete('gauntlet-autocomplete'), 150));

    // Submit button
    document.getElementById('gauntlet-submit')?.addEventListener('click', submitTyped);

    // Hard mode button
    document.getElementById('hard-mode-btn')?.addEventListener('click', () => {
      Game.showScreen('screen-gauntlet');
      startHardMode();
    });

    // Ultimate Gauntlet — show as unlocked if hard mode has been beaten
    function refreshUltimateCard() {
      const beaten = localStorage.getItem('geoQuiz_hardModeBeaten');
      const card   = document.getElementById('ultimate-challenge-card');
      const btn    = document.getElementById('ultimate-gauntlet-btn');
      const icon   = document.getElementById('ultimate-icon');
      const title  = document.getElementById('ultimate-title');
      const desc   = document.getElementById('ultimate-desc');
      if (!card || !btn) return;
      if (beaten) {
        card.classList.add('unlocked');
        btn.disabled        = false;
        btn.textContent     = 'Enter';
        icon.textContent    = '⚔️';
        title.style.color   = '';
        if (desc) desc.textContent = 'All countries. Type every answer. Flags only — no shortcuts.';
      }
    }
    refreshUltimateCard();

    document.getElementById('ultimate-gauntlet-btn')?.addEventListener('click', () => {
      Game.showScreen('screen-gauntlet');
      startUltimateGauntlet();
    });

    // End buttons
    document.getElementById('gauntlet-play-again')?.addEventListener('click', () => {
      if (session?.isHardMode) {
        Game.showScreen('screen-gauntlet');
        startHardMode();
      } else {
        start();
      }
    });
    document.getElementById('gauntlet-change-settings')?.addEventListener('click', () => {
      document.getElementById('gauntlet-end').style.display  = 'none';
      document.getElementById('gauntlet-card').style.display = '';
      Game.showScreen('screen-gauntlet-setup');
    });
  }

  return { init, start, startHardMode, startUltimateGauntlet };
})();

// ── High Score helpers ────────────────────────────────────────────────────
function saveHighScore(mode, score, maxStreak) {
  const key = `geoQuiz_scores_${mode}`;
  let scores = [];
  try { scores = JSON.parse(localStorage.getItem(key) || '[]'); } catch {}
  scores.push({ score, date: new Date().toLocaleDateString(), streak: maxStreak || 0 });
  scores.sort((a, b) => b.score - a.score);
  scores = scores.slice(0, 10);
  localStorage.setItem(key, JSON.stringify(scores));
}

function loadHighScores() {
  const body = document.getElementById('scores-body');
  if (!body) return;
  body.innerHTML = '';

  const MODE_LABELS = { classic: 'Classic', borders: 'Borders', pathfinder: 'Pathfinder', gauntlet: 'Gauntlet', marathon: 'Marathon' };
  ['classic','borders','pathfinder','gauntlet','marathon'].forEach(mode => {
    const sec = document.createElement('div');
    sec.className = 'score-section';
    const h3 = document.createElement('h3');
    h3.textContent = MODE_LABELS[mode];
    sec.appendChild(h3);

    let scores = [];
    try { scores = JSON.parse(localStorage.getItem(`geoQuiz_scores_${mode}`) || '[]'); } catch {}

    if (!scores.length) {
      const p = document.createElement('p');
      p.className = 'no-scores';
      p.textContent = 'No scores yet — play a round!';
      sec.appendChild(p);
    } else {
      scores.forEach((s, i) => {
        const row = document.createElement('div');
        row.className = 'score-row';
        const streakHtml = s.streak ? `<span class="score-streak">🔥 ${s.streak}</span>` : '';
        row.innerHTML = `<span class="score-rank">#${i + 1}</span><span>${s.date}</span><span class="score-val">${s.score} pts</span>${streakHtml}`;
        sec.appendChild(row);
      });
    }
    body.appendChild(sec);
  });

  // Gauntlet Survivor badge
  const beaten = localStorage.getItem('geoQuiz_hardModeBeaten');
  if (beaten) {
    try {
      const d = JSON.parse(beaten);
      const badge = document.createElement('div');
      badge.className = 'gauntlet-badge';
      badge.innerHTML = `
        <div class="badge-trophy">🏆</div>
        <div class="badge-text">
          <div class="badge-title">Gauntlet Survivor</div>
          <div class="badge-sub">Conquered all ${d.total} countries &mdash; ${d.correct}/${d.total} correct &middot; ${d.date} &middot; ${d.score} pts</div>
        </div>`;
      body.appendChild(badge);
    } catch {}
  }

  // Ultimate Conqueror badge
  const ultimate = localStorage.getItem('geoQuiz_ultimateBeaten');
  if (ultimate) {
    try {
      const d = JSON.parse(ultimate);
      const perfectTag = d.perfect ? '<span class="perfect-tag">Perfect</span>' : '';
      const badge = document.createElement('div');
      badge.className = 'gauntlet-badge ultimate-badge';
      badge.innerHTML = `
        <div class="badge-trophy">⚔️</div>
        <div class="badge-text">
          <div class="badge-title">Ultimate Conqueror ${perfectTag}</div>
          <div class="badge-sub">Typed through all ${d.total} countries &mdash; ${d.correct}/${d.total} correct &middot; ${d.date} &middot; ${d.score} pts</div>
        </div>`;
      body.appendChild(badge);
    } catch {}
  }
}
