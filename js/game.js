/* ═══════════════════════════════ MAIN CONTROLLER ═════════════════════════ */
const Game = (() => {

  // ── Screen Navigation ─────────────────────────────────────────────────────
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) {
      target.classList.add('active');
      window.scrollTo(0, 0);
    }
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  function init() {
    // Load saved theme
    ThemeEngine.loadSaved();

    // Preload world-atlas shape data in background (free CDN, no key)
    ShapeRenderer.preload();

    // Init sub-modules
    ClassicMode.init();
    BordersMode.init();
    PathfinderMode.init();
    GauntletMode.init();
    MarathonMode.init();
    FlagDesigner.init();

    // ── Header nav ────────────────────────────────────────────────────────
    document.getElementById('btn-home').addEventListener('click', () => showScreen('screen-home'));

    document.getElementById('btn-theme-panel').addEventListener('click', () => {
      ThemeEngine.buildGrid();
      showScreen('screen-theme');
    });

    document.getElementById('btn-flag-designer').addEventListener('click', () => {
      showScreen('screen-flag-designer');
      FlagDesigner.render();
    });

    document.getElementById('btn-scores').addEventListener('click', () => {
      loadHighScores();
      showScreen('screen-scores');
    });

    // ── Mode cards & play buttons ─────────────────────────────────────────
    document.querySelectorAll('[data-mode]').forEach(el => {
      el.addEventListener('click', () => {
        const mode = el.dataset.mode;
        if (mode === 'classic') {
          showScreen('screen-classic-setup');
        } else if (mode === 'borders') {
          showScreen('screen-borders-setup');
        } else if (mode === 'pathfinder') {
          showScreen('screen-pathfinder-setup');
        } else if (mode === 'gauntlet') {
          showScreen('screen-gauntlet-setup');
        } else if (mode === 'marathon') {
          showScreen('screen-marathon-setup');
        }
      });
    });

    // ── Back buttons ──────────────────────────────────────────────────────
    document.getElementById('classic-back').addEventListener('click',        () => showScreen('screen-home'));
    document.getElementById('classic-setup-back').addEventListener('click', () => showScreen('screen-home'));
    document.getElementById('borders-setup-back').addEventListener('click', () => showScreen('screen-home'));
    document.getElementById('borders-back').addEventListener('click',        () => showScreen('screen-borders-setup'));
    document.getElementById('pathfinder-setup-back').addEventListener('click', () => showScreen('screen-home'));
    document.getElementById('pathfinder-back').addEventListener('click',    () => showScreen('screen-pathfinder-setup'));
    document.getElementById('gauntlet-back').addEventListener('click',      () => showScreen('screen-home'));
    document.getElementById('gauntlet-setup-back').addEventListener('click',() => showScreen('screen-home'));
    document.getElementById('theme-back').addEventListener('click',         () => showScreen('screen-home'));
    document.getElementById('theme-ok').addEventListener('click',           () => showScreen('screen-home'));
    document.getElementById('flag-back').addEventListener('click',          () => showScreen('screen-home'));
    document.getElementById('marathon-setup-back').addEventListener('click',() => showScreen('screen-home'));
    document.getElementById('marathon-back').addEventListener('click',      () => showScreen('screen-home'));
    document.getElementById('scores-back').addEventListener('click',        () => showScreen('screen-home'));

    // ── Classic start ─────────────────────────────────────────────────────
    document.getElementById('classic-start-btn').addEventListener('click', () => {
      showScreen('screen-classic');
      ClassicMode.start();
    });

    // ── Gauntlet start ────────────────────────────────────────────────────
    document.getElementById('borders-start-btn').addEventListener('click', () => {
      showScreen('screen-borders');
      BordersMode.start();
    });

    document.getElementById('pathfinder-start-btn').addEventListener('click', () => {
      showScreen('screen-pathfinder');
      PathfinderMode.start();
    });

    document.getElementById('gauntlet-start-btn').addEventListener('click', () => {
      showScreen('screen-gauntlet');
      GauntletMode.start();
    });

    document.getElementById('marathon-start-btn').addEventListener('click', () => {
      showScreen('screen-marathon');
      MarathonMode.start();
    });

    // ── Radio chip click-to-select ────────────────────────────────────────
    document.querySelectorAll('.radio-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const input = chip.querySelector('input[type=radio]');
        if (!input) return;
        const name = input.name;
        document.querySelectorAll(`input[name="${name}"]`).forEach(inp => {
          inp.closest('.radio-chip')?.classList.remove('selected');
        });
        input.checked = true;
        chip.classList.add('selected');
      });
    });

    // ── Load custom flag into theme grid if exists ────────────────────────
    const savedFlag = FlagDesigner.loadSaved();
    if (savedFlag) {
      const nameEl = document.getElementById('flag-country-name');
      if (nameEl) nameEl.value = savedFlag.name || '';
    }

    // ── Keyboard shortcut: Escape → home ─────────────────────────────────
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        const active = document.querySelector('.screen.active');
        if (active && active.id !== 'screen-home') showScreen('screen-home');
      }
    });
  }

  return { init, showScreen };
})();

// ── Boot ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', Game.init);
