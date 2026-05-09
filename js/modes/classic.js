/* ═══════════════════════════════ CLASSIC MODE ════════════════════════════
   Customizable quiz: pick what you're shown and what you must answer.
   Given options : country name, capital, flag, shape
   Asked options : country name, capital, flag (flag = MC image picker)
═════════════════════════════════════════════════════════════════════════════*/
const ClassicMode = (() => {

  let settings = {
    given:   ['name', 'flag'],
    asked:   ['capital', 'name'],
    style:   'multiple-choice',
    qCount:  20,
    regions: ['Africa','Americas','Asia','Europe','Oceania'],
  };

  let session = null;

  const GIVEN_LABEL = {
    name:    c => c.name,
    capital: c => c.capital,
    flag:    c => c.iso2,
    shape:   c => c.code,
  };

  const ASKED_LABEL = {
    name:    'country name',
    capital: 'capital city',
    flag:    'flag',
  };

  const PROMPT = {
    'name→capital':    n => `What is the capital of ${n}?`,
    'name→name':       n => `What country is this? (${n})`,   // filtered out
    'name→flag':       n => `Which flag belongs to ${n}?`,
    'capital→name':    n => `${n} is the capital of which country?`,
    'capital→capital': n => `(invalid)`,
    'capital→flag':    n => `Which flag belongs to the country whose capital is ${n}?`,
    'flag→name':       _  => 'Which country does this flag belong to?',
    'flag→capital':    _  => 'What is the capital of the country shown?',
    'flag→flag':       _  => '(invalid)',
    'shape→name':      _  => 'Which country has this shape?',
    'shape→capital':   _  => 'What is the capital of the country shown?',
    'shape→flag':      _  => 'Which flag belongs to the country shown?',
  };

  function flagUrl(iso2) { return `https://flagcdn.com/w160/${iso2}.png`; }

  // ── Settings ──────────────────────────────────────────────────────────────
  function readSettings() {
    settings.given   = Array.from(document.querySelectorAll('input[name="classic-given"]:checked')).map(e => e.value);
    settings.asked   = Array.from(document.querySelectorAll('input[name="classic-asked"]:checked')).map(e => e.value);
    settings.style   = document.querySelector('input[name="classic-style"]:checked')?.value ?? 'multiple-choice';
    settings.qCount  = parseInt(document.getElementById('classic-q-count')?.value ?? 20);
    settings.regions = Array.from(document.querySelectorAll('input[name="classic-region"]:checked')).map(e => e.value);

    if (!settings.given.length)  settings.given  = ['name'];
    if (!settings.asked.length)  settings.asked  = ['capital'];
    if (!settings.regions.length) settings.regions = ['Africa','Americas','Asia','Europe','Oceania'];
  }

  // ── Question generation ───────────────────────────────────────────────────
  function validPairs() {
    const pairs = [];
    for (const g of settings.given) {
      for (const a of settings.asked) {
        if (g === a) continue;           // name→name, capital→capital, flag→flag: skip
        if (g === 'capital' && a === 'capital') continue;
        pairs.push({ given: g, asked: a });
      }
    }
    return pairs.length ? pairs : [{ given: 'name', asked: 'capital' }];
  }

  function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function distractors(correctCode, correctVal, getFn, count = 3) {
    const pool = COUNTRY_LIST.filter(c => c.code !== correctCode && settings.regions.includes(c.region));
    const used = new Set([correctVal]);
    const out  = [];
    let tries = 0;
    while (out.length < count && tries++ < 300) {
      const c   = randomFrom(pool);
      const val = getFn(c);
      if (val && !used.has(val)) { used.add(val); out.push(val); }
    }
    return out;
  }

  function buildQuestion(pair, country) {
    const pool    = COUNTRY_LIST.filter(c => settings.regions.includes(c.region)
                      && (pair.given !== 'shape' || ShapeRenderer.hasShape(c.code)));
    if (!pool.length) return null;
    if (!country) country = randomFrom(pool);

    const givenVal = GIVEN_LABEL[pair.given](country);
    const promptFn = PROMPT[`${pair.given}→${pair.asked}`];
    const prompt   = promptFn ? promptFn(givenVal) : `?`;

    let answer, wrongFn;
    switch (pair.asked) {
      case 'name':    answer = country.name;    wrongFn = c => c.name;    break;
      case 'capital': answer = country.capital; wrongFn = c => c.capital; break;
      case 'flag':    answer = country.iso2;    wrongFn = c => c.iso2;    break;
    }

    const wrongs  = distractors(country.code, answer, wrongFn, 3);
    const choices = shuffle([answer, ...wrongs]);

    return { ...pair, country, givenVal, prompt, answer, choices };
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
    const pairs = validPairs();
    const qs    = [];
    const usedPerPair = {};
    for (let i = 0; i < settings.qCount; i++) {
      const pair = pairs[i % pairs.length];
      const key  = `${pair.given}→${pair.asked}`;
      if (!usedPerPair[key]) usedPerPair[key] = new Set();
      const fullPool  = COUNTRY_LIST.filter(c => settings.regions.includes(c.region)
                          && (pair.given !== 'shape' || ShapeRenderer.hasShape(c.code)));
      const freshPool = fullPool.filter(c => !usedPerPair[key].has(c.code));
      const pool      = freshPool.length ? freshPool : (usedPerPair[key] = new Set(), fullPool);
      if (!pool.length) continue;
      const country   = randomFrom(pool);
      usedPerPair[key].add(country.code);
      const q = buildQuestion(pair, country);
      if (q) qs.push(q);
    }
    return shuffle(qs);
  }

  // ── Session ───────────────────────────────────────────────────────────────
  function start() {
    readSettings();
    const questions = generateQuestions();
    session = { questions, index: 0, score: 0, streak: 0, maxStreak: 0, answers: [] };

    document.getElementById('classic-q-total').textContent = questions.length;
    document.getElementById('classic-end').style.display   = 'none';
    document.getElementById('classic-card').style.display  = '';
    updateProgress();
    showQuestion();
  }

  // ── Display ───────────────────────────────────────────────────────────────
  function showQuestion() {
    const q = session.questions[session.index];
    if (!q) { endSession(); return; }

    document.getElementById('classic-q-num').textContent   = session.index + 1;
    document.getElementById('classic-score').textContent   = session.score;
    document.getElementById('classic-streak').textContent  = session.streak;
    document.getElementById('classic-prompt').textContent  = q.prompt;
    document.getElementById('classic-feedback').style.display = 'none';

    const badge = `${q.given.charAt(0).toUpperCase() + q.given.slice(1)} → ${q.asked.charAt(0).toUpperCase() + q.asked.slice(1)}`;
    document.getElementById('classic-q-badge').textContent = badge;

    renderGiven(q);
    renderChoices(q);
    updateProgress();
  }

  function renderGiven(q) {
    const area = document.getElementById('classic-given-area');
    area.innerHTML = '';

    switch (q.given) {
      case 'name': {
        const el = document.createElement('div');
        el.className = 'classic-given-name';
        el.textContent = q.givenVal;
        area.appendChild(el);
        break;
      }
      case 'capital': {
        const el = document.createElement('div');
        el.className = 'classic-given-capital';
        el.innerHTML = `<span class="given-label">Capital</span><span class="given-value">${q.givenVal}</span>`;
        area.appendChild(el);
        break;
      }
      case 'flag': {
        const img = document.createElement('img');
        img.className = 'gauntlet-flag classic-given-flag';
        img.src = flagUrl(q.givenVal);
        img.alt = 'Flag';
        area.appendChild(img);
        break;
      }
      case 'shape': {
        ShapeRenderer.render(area, q.givenVal);
        break;
      }
    }
  }

  function renderChoices(q) {
    const choicesEl = document.getElementById('classic-choices');
    const typeRow   = document.getElementById('classic-type-row');
    const inputEl   = document.getElementById('classic-input');

    choicesEl.innerHTML = '';

    const useTypeIn = settings.style === 'type-in' && q.asked !== 'flag';

    if (!useTypeIn) {
      choicesEl.style.display = '';
      typeRow.style.display   = 'none';

      if (q.asked === 'flag') {
        // Flag picker: 2×2 grid of flag images
        choicesEl.className = 'classic-flag-choices';
        q.choices.forEach(iso2 => {
          const btn = document.createElement('button');
          btn.className = 'flag-choice-btn';
          const img = document.createElement('img');
          img.src = flagUrl(iso2);
          img.alt = iso2;
          btn.appendChild(img);
          btn.addEventListener('click', () => selectChoice(iso2, q));
          choicesEl.appendChild(btn);
        });
      } else {
        choicesEl.className = 'gauntlet-choices';
        q.choices.forEach(choice => {
          const btn = document.createElement('button');
          btn.className   = 'choice-btn';
          btn.textContent = choice;
          btn.addEventListener('click', () => selectChoice(choice, q));
          choicesEl.appendChild(btn);
        });
      }
    } else {
      choicesEl.style.display = 'none';
      typeRow.style.display   = '';
      inputEl.value           = '';
      inputEl.focus();
      closeAutocomplete('classic-autocomplete');
    }
  }

  // ── Answer handling ───────────────────────────────────────────────────────
  function selectChoice(choice, q) {
    const correct = choice === q.answer;
    if (q.asked === 'flag') {
      document.querySelectorAll('.flag-choice-btn').forEach(btn => {
        btn.disabled = true;
        const iso2 = btn.querySelector('img')?.alt;
        if (iso2 === q.answer) btn.classList.add('correct');
        if (iso2 === choice && !correct) btn.classList.add('wrong');
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

  function submitTyped() {
    const q     = session.questions[session.index];
    const input = document.getElementById('classic-input');
    const val   = input.value.trim().toLowerCase();
    if (!val) return;
    const correct = val === q.answer.toLowerCase() || q.answer.toLowerCase().includes(val);
    registerAnswer(correct, q);
  }

  function registerAnswer(correct, q) {
    if (correct) {
      session.streak++;
      session.maxStreak = Math.max(session.maxStreak, session.streak);
      const bonus = Math.min(session.streak - 1, 5) * 2;
      const pts   = 10 + bonus;
      session.score += pts;
      showFeedback(true, `✓ Correct! +${pts}${bonus ? ` (streak ×${session.streak})` : ''}`);
    } else {
      session.streak = 0;
      const answerLabel = q.asked === 'flag'
        ? COUNTRIES[Object.keys(COUNTRIES).find(k => COUNTRIES[k].iso2 === q.answer)]?.name ?? q.answer
        : q.answer;
      showFeedback(false, `✗ Answer: ${answerLabel}`);
    }
    session.answers.push({ correct, q });

    setTimeout(() => {
      session.index++;
      if (session.index >= session.questions.length) endSession();
      else showQuestion();
    }, correct ? 850 : 1600);
  }

  function showFeedback(correct, msg) {
    const el = document.getElementById('classic-feedback');
    el.textContent = msg;
    el.className   = `gauntlet-feedback ${correct ? 'correct' : 'wrong'}`;
    el.style.display = '';
    document.getElementById('classic-score').textContent  = session.score;
    document.getElementById('classic-streak').textContent = session.streak;
  }

  function updateProgress() {
    if (!session) return;
    const pct = (session.index / session.questions.length) * 100;
    document.getElementById('classic-progress').style.width = pct + '%';
  }

  // ── End ───────────────────────────────────────────────────────────────────
  function endSession() {
    document.getElementById('classic-card').style.display = 'none';
    document.getElementById('classic-end').style.display  = '';
    document.getElementById('classic-progress').style.width = '100%';
    document.getElementById('classic-final-score').textContent = session.score;

    const total   = session.questions.length;
    const correct = session.answers.filter(a => a.correct).length;
    const pct     = Math.round((correct / total) * 100);

    let msg = `${correct}/${total} correct (${pct}%). `;
    if      (pct === 100) msg += '🏆 Perfect!';
    else if (pct >= 80)   msg += '🌟 Excellent!';
    else if (pct >= 60)   msg += '👍 Good effort!';
    else                  msg += '📚 Keep studying!';
    document.getElementById('classic-final-msg').textContent = msg;
    saveHighScore('classic', session.score, session.maxStreak);
  }

  // ── Autocomplete ──────────────────────────────────────────────────────────
  function handleTypeInput(val) {
    const q = session?.questions[session.index];
    if (!q) return;
    let suggestions = autocomplete(val, 5).map(s => s.name);
    if (q.asked === 'capital') {
      const clean = val.trim().toLowerCase();
      suggestions = COUNTRY_LIST
        .filter(c => c.capital.toLowerCase().startsWith(clean))
        .concat(COUNTRY_LIST.filter(c => !c.capital.toLowerCase().startsWith(clean) && c.capital.toLowerCase().includes(clean)))
        .slice(0, 5)
        .map(c => c.capital);
    }
    const list = document.getElementById('classic-autocomplete');
    list.innerHTML = '';
    if (!suggestions.length || !val.trim()) { list.classList.remove('open'); return; }
    suggestions.forEach(s => {
      const item = document.createElement('div');
      item.className = 'autocomplete-item';
      item.textContent = s;
      item.addEventListener('mousedown', e => {
        e.preventDefault();
        document.getElementById('classic-input').value = s;
        closeAutocomplete('classic-autocomplete');
        submitTyped();
      });
      list.appendChild(item);
    });
    list.classList.add('open');
  }

  // ── DOM wiring ────────────────────────────────────────────────────────────
  function init() {
    // Slider
    const slider = document.getElementById('classic-q-count');
    const label  = document.getElementById('classic-q-count-label');
    if (slider && label) slider.addEventListener('input', () => { label.textContent = `${slider.value} questions`; });

    // Answer style radio visual update
    document.querySelectorAll('input[name="classic-style"]').forEach(inp => {
      inp.addEventListener('change', () => {
        document.querySelectorAll('label[data-value]').forEach(l => {
          if (['multiple-choice','type-in'].includes(l.dataset.value)) {
            l.classList.toggle('selected', l.dataset.value === inp.value);
          }
        });
      });
    });

    // Type-in
    const cinput = document.getElementById('classic-input');
    cinput?.addEventListener('input', e => handleTypeInput(e.target.value));
    cinput?.addEventListener('keydown', e => {
      if (e.key === 'Enter') { submitTyped(); closeAutocomplete('classic-autocomplete'); }
    });
    cinput?.addEventListener('blur', () => setTimeout(() => closeAutocomplete('classic-autocomplete'), 150));

    document.getElementById('classic-submit')?.addEventListener('click', submitTyped);

    // End screen
    document.getElementById('classic-play-again')?.addEventListener('click', start);
    document.getElementById('classic-change-settings')?.addEventListener('click', () => {
      document.getElementById('classic-end').style.display  = 'none';
      document.getElementById('classic-card').style.display = '';
      Game.showScreen('screen-classic-setup');
    });
  }

  return { init, start };
})();
