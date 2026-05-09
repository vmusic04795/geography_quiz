/* ══════════════════════════════ MARATHON MODE ══════════════════════════════
   Name every country (or capital) from memory in the regions you choose.
   Streak multiplier rewards correct spelling; fuzzy matches score but reset it.
═══════════════════════════════════════════════════════════════════════════════*/
const MarathonMode = (() => {
  let settings = {
    mode:    'countries',   // 'countries' | 'capitals'
    regions: ['Africa','Americas','Asia','Europe','Oceania'],
  };

  let session = null;
  let encouragementTimer = null;

  // ── Capitals worth a special shout-out ────────────────────────────────────
  const IMPRESSIVE_CAPS = new Set([
    "Ouagadougou","Antananarivo","Naypyidaw","Nuku'alofa","Funafuti",
    "Yamoussoukro","Ulaanbaatar","Asmara","Palikir","Majuro","Malabo",
    "Lilongwe","Gitega","Moroni","Ngerulmud","Belmopan","Mbabane",
    "Maseru","N'Djamena","Djibouti","Vientiane","Phnom Penh","Ngerulmud",
    "Tarawa","Honiara","Port Moresby","Nukualofa",
  ]);

  function isImpressive(answer) {
    return IMPRESSIVE_CAPS.has(answer) || answer.replace(/[\s'-]/g,'').length >= 11;
  }

  // ── Message banks ─────────────────────────────────────────────────────────
  const MSG = {
    impressive: [
      n => `${n}?! Are you a cartographer in disguise?`,
      n => `${n}! Your keyboard deserves a vacation.`,
      n => `${n}! Geography teachers weep with joy.`,
      n => `${n}?! We didn't think anyone would actually get that.`,
      n => `${n}! Your brain has absolutely no right knowing that.`,
      n => `${n}! The country itself is impressed.`,
      n => `${n}! Even the spell-checker gave up on that one.`,
      n => `${n}?! Bless you. (Also, that's a capital city.)`,
    ],
    streak: {
      5:  ["5 in a row! Suspiciously good.",
           "Streak ×2! You actually know these.",
           "5 straight, all spelled right. Hmm."],
      10: ["10 streak! Are you even human?",
           "TEN in a row! The globe is starting to respect you.",
           "Streak ×3! We're keeping an eye on you."],
      15: ["15 straight! Your geography teacher just gasped somewhere.",
           "Streak × 15! At this point you're just showing off."],
      20: ["TWENTY in a row! You ARE the atlas.",
           "Streak of 20! Honestly kind of rude how good you are.",
           "20 STRAIGHT! Just apply to the UN already."],
      30: ["THIRTY STREAK. We're calling someone.",
           "30 in a row! A country should be named after you.",
           "Streak × 30! You absolute geography menace."],
      50: ["FIFTY. STREAK. We bow to you.",
           "50 in a row! Do you have a globe instead of a brain?",
           "FIFTY STRAIGHT! Historians will discuss this session."],
    },
    continent: {
      Africa: [
        "Africa complete! Safari guide energy unlocked. 🦁",
        "All of Africa! 54 countries, all from memory. Respect.",
        "Africa cleared! Your lion is very proud.",
        "You got every African country! The continent quietly applauds.",
      ],
      Americas: [
        "The Americas cleared! North, Central, South — all yours.",
        "Americas done! The bald eagle and the condor both nod.",
        "You cleared the Americas. That's a lot of hemisphere.",
        "All of the Americas! From tip to tip, mentally at least.",
      ],
      Asia: [
        "All of Asia! That is a LOT of continent.",
        "Asia cleared! You visited more countries mentally than most do in a lifetime.",
        "Asia complete! The Great Wall salutes your memory.",
        "Every country in Asia! Quietly unhinged. Well done.",
      ],
      Europe: [
        "Europe complete! EuroVision champion energy. 🎤",
        "All of Europe! Congratulations, you're basically qualified for a geography PhD.",
        "Europe cleared! Your passport is jealous.",
        "Every European country! 44 of them! That's wild. Respect.",
      ],
      Oceania: [
        "Oceania complete! You remembered ALL those islands?! Legendary.",
        "All of Oceania! Most people forget half these countries exist.",
        "Oceania cleared! The Pacific Ocean is genuinely impressed.",
        "Every Oceanian country! Do you even know where Nauru is on a map? Do you really?",
      ],
    },
    milestone: {
      10:  ["10 down! Your mental map is loading nicely.",
            "Double digits! The world awaits."],
      25:  ["25 countries! Basically a UN ambassador at this point.",
            "A quarter-century of answers! Geography is your thing."],
      50:  ["50 DOWN! You're halfway to a full world atlas run.",
            "Fifty answers! The world is paying close attention."],
      75:  ["75! In the home stretch now.",
            "75 — at this point just commit. You've got this."],
      100: ["ONE HUNDRED. You mad genius. 🧠",
            "100 answers! Historians will write about this session."],
      150: ["150! Is this even real?",
            "150 down! You can almost see the finish line."],
    },
    duplicate: [
      n => `Already got ${n}! Try somewhere new.`,
      n => `${n} is already on your list. Ambition noted.`,
      n => `You've already conquered ${n}. One per customer!`,
      n => `${n} again? It's already counted — scroll down.`,
      n => `${n} is sitting right there on your list. 👀`,
    ],
    fuzzy: [
      (i, c) => `Close! It's "${c}" — accepted. +5 pts (streak reset).`,
      (i, c) => `Almost — "${c}" it is. +5 pts, streak gone.`,
      (i, c) => `Spelling matters! "${c}" accepted for 5 pts. Streak reset.`,
      (i, c) => `Near miss — "${c}" works, but your streak didn't survive it.`,
    ],
    notFound: [
      "Not recognized — keep thinking!",
      "Doesn't match anything in the pool. Try another!",
      "Hmm, not in the list. Keep going!",
      "That one's not here. Another thought?",
    ],
    allDone: [
      "YOU NAMED THEM ALL. 🌍 Absolute legend.",
      "EVERY SINGLE ONE. You are the map.",
      "PERFECT MEMORY. Your geographical brain is terrifying (in a good way).",
    ],
  };

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  // ── Levenshtein fuzzy match ───────────────────────────────────────────────
  function levenshtein(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({length: m+1}, (_, i) =>
      Array.from({length: n+1}, (_, j) => i===0 ? j : j===0 ? i : 0));
    for (let i=1; i<=m; i++)
      for (let j=1; j<=n; j++)
        dp[i][j] = a[i-1]===b[j-1] ? dp[i-1][j-1] : 1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);
    return dp[m][n];
  }

  function tryMatch(input, target) {
    const a = input.trim().toLowerCase();
    const b = target.trim().toLowerCase();
    if (a === b) return 'exact';
    const maxErr = b.length <= 4 ? 0 : Math.floor(b.length * 0.2);
    return levenshtein(a, b) <= maxErr ? 'fuzzy' : 'none';
  }

  // ── Streak multiplier (increases every 5 correct in a row, caps at ×5) ───
  function multLevel() {
    return Math.min(5, Math.floor(session.streak / 5) + 1);
  }

  // ── Session ───────────────────────────────────────────────────────────────
  function readSettings() {
    settings.mode    = document.querySelector('input[name="marathon-mode"]:checked')?.value ?? 'countries';
    settings.regions = Array.from(document.querySelectorAll('input[name="marathon-region"]:checked')).map(e => e.value);
    if (!settings.regions.length) settings.regions = ['Africa','Americas','Asia','Europe','Oceania'];
  }

  function start() {
    readSettings();
    const pool = COUNTRY_LIST.filter(c => settings.regions.includes(c.region));
    session = {
      pool,
      found:          new Set(),
      score:          0,
      streak:         0,
      maxStreak:      0,
      continentsDone: new Set(),
      startTime:      Date.now(),
    };

    const isCapitals = settings.mode === 'capitals';
    document.getElementById('marathon-found').textContent  = 0;
    document.getElementById('marathon-total').textContent  = pool.length;
    document.getElementById('marathon-score').textContent  = 0;
    document.getElementById('marathon-streak').textContent = 0;
    document.getElementById('marathon-mult').textContent   = '×1';
    document.getElementById('marathon-found-list').innerHTML = '';
    document.getElementById('marathon-encouragement').style.display = 'none';
    document.getElementById('marathon-end').style.display  = 'none';
    document.getElementById('marathon-card').style.display = '';
    document.getElementById('marathon-input').placeholder  = isCapitals
      ? 'Type a capital city…' : 'Type a country name…';
    document.getElementById('marathon-prompt').textContent = isCapitals
      ? 'Name every capital city in the selected regions:'
      : 'Name every country in the selected regions:';

    renderProgress();
    document.getElementById('marathon-input').focus();
  }

  // ── Submit answer ─────────────────────────────────────────────────────────
  function submit() {
    const input = document.getElementById('marathon-input');
    const val = input.value.trim();
    if (!val || !session) return;
    input.value = '';

    const field = settings.mode === 'capitals' ? 'capital' : 'name';

    let exactHit = null, fuzzyHit = null, dupHit = null;

    for (const country of session.pool) {
      const result = tryMatch(val, country[field]);
      if (result === 'none') continue;
      if (session.found.has(country.code)) {
        if (!dupHit) dupHit = country;
        continue;
      }
      if (result === 'exact') { exactHit = country; break; }
      if (result === 'fuzzy' && !fuzzyHit) fuzzyHit = country;
    }

    if (exactHit) {
      registerFound(exactHit, 'exact', val);
    } else if (fuzzyHit) {
      registerFound(fuzzyHit, 'fuzzy', val);
    } else if (dupHit) {
      showMsg(pick(MSG.duplicate)(dupHit[field]), 'dupe');
    } else {
      shakeInput();
      showMsg(pick(MSG.notFound), 'miss');
    }
  }

  function registerFound(country, matchType, originalInput) {
    session.found.add(country.code);
    const field   = settings.mode === 'capitals' ? 'capital' : 'name';
    const answer  = country[field];
    const isExact = matchType === 'exact';
    let pts, msg = null;

    if (isExact) {
      session.streak++;
      session.maxStreak = Math.max(session.maxStreak, session.streak);
      const mult = multLevel();
      pts = 10 * mult;
      session.score += pts;
      document.getElementById('marathon-mult').textContent = `×${mult}`;

      // Impressive spelling
      if (settings.mode === 'capitals' && isImpressive(answer)) {
        msg = pick(MSG.impressive)(answer);
      }
      // Streak milestone
      if (!msg) {
        for (const m of [50, 30, 20, 15, 10, 5]) {
          if (session.streak === m && MSG.streak[m]) { msg = pick(MSG.streak[m]); break; }
        }
      }
    } else {
      pts = 5;
      session.score += pts;
      session.streak = 0;
      document.getElementById('marathon-mult').textContent = '×1';
      msg = pick(MSG.fuzzy)(originalInput, answer);
    }

    // Count milestone (only if no other msg)
    const count = session.found.size;
    if (!msg) {
      for (const m of [150, 100, 75, 50, 25, 10]) {
        if (count === m && MSG.milestone[m]) { msg = pick(MSG.milestone[m]); break; }
      }
    }

    // Continent completion
    if (!msg) {
      for (const region of settings.regions) {
        if (session.continentsDone.has(region)) continue;
        const rPool = session.pool.filter(c => c.region === region);
        if (rPool.length && rPool.every(c => session.found.has(c.code))) {
          session.continentsDone.add(region);
          msg = pick(MSG.continent[region] ?? [`${region} complete!`]);
        }
      }
    }

    document.getElementById('marathon-found').textContent  = count;
    document.getElementById('marathon-score').textContent  = session.score;
    document.getElementById('marathon-streak').textContent = session.streak;

    addChipToList(country, pts, isExact, answer);
    if (msg) showMsg(msg, isExact ? 'good' : 'fuzzy');
    renderProgress();
    saveHighScore('marathon', session.score, session.maxStreak);

    if (count === session.pool.length) {
      setTimeout(() => endSession(false), 900);
    }
  }

  // ── Chip list ─────────────────────────────────────────────────────────────
  const REGION_ORDER = ['Africa','Americas','Asia','Europe','Oceania'];

  function addChipToList(country, pts, exact, answer) {
    const list = document.getElementById('marathon-found-list');

    let group = document.getElementById(`m-grp-${country.region}`);
    if (!group) {
      group = document.createElement('div');
      group.className = 'marathon-continent-group';
      group.id = `m-grp-${country.region}`;

      const label = document.createElement('div');
      label.className = 'marathon-continent-label';
      label.textContent = country.region;
      group.appendChild(label);

      const chips = document.createElement('div');
      chips.className = 'marathon-chips';
      chips.id = `m-chips-${country.region}`;
      group.appendChild(chips);

      const myIdx = REGION_ORDER.indexOf(country.region);
      const after = [...list.querySelectorAll('.marathon-continent-group')]
        .find(el => REGION_ORDER.indexOf(el.id.replace('m-grp-','')) > myIdx);
      if (after) list.insertBefore(group, after);
      else list.appendChild(group);
    }

    const chip = document.createElement('span');
    chip.className = `m-chip${exact ? '' : ' m-chip-fuzzy'}`;

    const label = settings.mode === 'capitals'
      ? `${answer} · ${country.name}`
      : answer;
    chip.textContent = label;

    const badge = document.createElement('span');
    badge.className = 'm-pts';
    badge.textContent = `+${pts}`;
    chip.appendChild(badge);

    document.getElementById(`m-chips-${country.region}`).appendChild(chip);
    chip.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // ── Encouragement banner ──────────────────────────────────────────────────
  function showMsg(text, type) {
    const el = document.getElementById('marathon-encouragement');
    el.textContent = text;
    el.className = `marathon-encouragement ${type}`;
    el.style.display = '';
    clearTimeout(encouragementTimer);
    const dur = type === 'miss' ? 1800 : type === 'dupe' ? 2200 : 3400;
    encouragementTimer = setTimeout(() => { el.style.display = 'none'; }, dur);
  }

  // ── Input shake for wrong answers ─────────────────────────────────────────
  function shakeInput() {
    const el = document.getElementById('marathon-input');
    el.classList.remove('shake');
    void el.offsetWidth;
    el.classList.add('shake');
    setTimeout(() => el.classList.remove('shake'), 450);
  }

  // ── Continent progress bars ───────────────────────────────────────────────
  function renderProgress() {
    const el = document.getElementById('marathon-progress');
    el.innerHTML = '';
    for (const region of settings.regions) {
      const rPool  = session.pool.filter(c => c.region === region);
      const found  = rPool.filter(c => session.found.has(c.code)).length;
      const total  = rPool.length;
      const pct    = total ? (found / total) * 100 : 0;
      const done   = found === total && total > 0;

      const row = document.createElement('div');
      row.className = `m-prog-row${done ? ' done' : ''}`;
      row.innerHTML = `
        <span class="m-prog-label">${region}</span>
        <div class="m-prog-bar"><div class="m-prog-fill" style="width:${pct}%"></div></div>
        <span class="m-prog-count">${found}/${total}</span>
      `;
      el.appendChild(row);
    }
  }

  // ── End session ───────────────────────────────────────────────────────────
  function endSession(giveUp) {
    document.getElementById('marathon-card').style.display = 'none';
    document.getElementById('marathon-end').style.display  = '';

    const found   = session.found.size;
    const total   = session.pool.length;
    const elapsed = Math.round((Date.now() - session.startTime) / 1000);
    const mins    = Math.floor(elapsed / 60);
    const secs    = elapsed % 60;
    const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
    const field   = settings.mode === 'capitals' ? 'capital' : 'name';

    if (!giveUp && found === total) {
      document.getElementById('marathon-end-title').textContent = pick(MSG.allDone);
      launchMarathonConfetti();
    } else {
      const pct = Math.round((found / total) * 100);
      document.getElementById('marathon-end-title').textContent = giveUp
        ? `You named ${found} of ${total} — not bad.`
        : `${pct}% — impressive run!`;
    }

    document.getElementById('marathon-final-score').textContent = session.score.toLocaleString();

    document.getElementById('marathon-final-stats').innerHTML = `
      <div class="final-stat"><span>Named</span><strong>${found} / ${total}</strong></div>
      <div class="final-stat"><span>Best Streak</span><strong>🔥 ${session.maxStreak}</strong></div>
      <div class="final-stat"><span>Time</span><strong>${timeStr}</strong></div>
    `;

    const missedEl = document.getElementById('marathon-missed');
    missedEl.innerHTML = '';
    if (giveUp) {
      const missed = session.pool.filter(c => !session.found.has(c.code));
      if (missed.length) {
        const h = document.createElement('div');
        h.className = 'missed-header';
        h.textContent = `Missed (${missed.length}):`;
        missedEl.appendChild(h);
        const wrap = document.createElement('div');
        wrap.className = 'marathon-chips';
        missed.forEach(c => {
          const chip = document.createElement('span');
          chip.className = 'chip chip-missed';
          chip.textContent = settings.mode === 'capitals'
            ? `${c[field]} (${c.name})`
            : c[field];
          wrap.appendChild(chip);
        });
        missedEl.appendChild(wrap);
      }
    }
  }

  function launchMarathonConfetti() {
    const colors = ['#ffd700','#ff6b35','#4f8ef7','#7b5cf6','#3ecf8e','#f7b955','#ff4757','#ffffff'];
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden;';
    for (let i = 0; i < 120; i++) {
      const p = document.createElement('div');
      const clr = colors[Math.floor(Math.random() * colors.length)];
      const sz  = 5 + Math.random() * 9;
      p.style.cssText = `position:absolute;left:${Math.random()*100}%;top:-16px;width:${sz}px;height:${sz}px;`
        + `background:${clr};border-radius:${Math.random()>.45?'50%':'2px'};`
        + `animation:confettiFall ${2.4+Math.random()*2.2}s ${Math.random()*1.8}s ease-in forwards;`
        + `--drift:${(Math.random()-.5)*200}px;`;
      wrap.appendChild(p);
    }
    document.body.appendChild(wrap);
    setTimeout(() => wrap.remove(), 6500);
  }

  // ── DOM wiring ────────────────────────────────────────────────────────────
  function init() {
    // Mode radio visual
    document.querySelectorAll('input[name="marathon-mode"]').forEach(inp => {
      inp.addEventListener('change', () => {
        document.querySelectorAll('label[data-m-val]').forEach(l => {
          l.classList.toggle('selected', l.dataset.mVal === inp.value);
        });
      });
    });

    // Input
    document.getElementById('marathon-input')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') submit();
    });
    document.getElementById('marathon-submit')?.addEventListener('click', submit);

    // Give up
    document.getElementById('marathon-give-up')?.addEventListener('click', () => endSession(true));

    // End screen
    document.getElementById('marathon-play-again')?.addEventListener('click', () => {
      Game.showScreen('screen-marathon');
      start();
    });
    document.getElementById('marathon-change-settings')?.addEventListener('click', () => {
      document.getElementById('marathon-end').style.display  = 'none';
      document.getElementById('marathon-card').style.display = '';
      Game.showScreen('screen-marathon-setup');
    });
  }

  return { init, start };
})();
