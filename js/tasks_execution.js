/**
 * Normaliseert de execution-spec uit de task.
 * Toegestane vormen:
 *   { type: 'once' }
 *   { type: 'multiple', count: <int>=3 }
 *   { type: 'timer', minutes?: <int>=0, seconds?: <int>=60 }
 */
function normalizeExecution(execution) {
  const type = (execution?.type ?? 'once').toLowerCase();

  if (type === 'multiple') {
    const raw = execution?.count;
    let count = Number.isFinite(raw) ? Math.trunc(raw) : 3;
    if (count < 1) count = 1;
    return { type: 'multiple', count };
  }

  if (type === 'timer') {
    const m = Number.isFinite(execution?.minutes) ? Math.trunc(execution.minutes) : 0;
    const s = Number.isFinite(execution?.seconds) ? Math.trunc(execution.seconds) : 60;
    let total = Math.max(0, m * 60 + s);
    // Nooit 0: geef minimaal 1 seconde zodat UI logisch aanvoelt
    if (total === 0) total = 1;
    return { type: 'timer', totalSeconds: total, minutes: m, seconds: s };
  }

  return { type: 'once' };
}

function formatTimeMMSS(totalSeconds) {
  const sec = Math.max(0, Math.trunc(totalSeconds));
  const mm = Math.floor(sec / 60);
  const ss = sec % 60;
  return `${mm}:${String(ss).padStart(2, '0')}`;
}

/**
 * Bouwt de timer UI.
 * Retourneert een <div> met display + start/pauze/reset.
 * Dispatcht custom events:
 *  - 'task:timer:start'
 *  - 'task:timer:pause'
 *  - 'task:timer:reset'
 *  - 'task:timer:finish'  (bij 0)
 */
function createTimerElement(totalSecondsInit = 60) {
  const root = document.createElement('div');
  root.className = 'task-timer row';

  const display = document.createElement('span');
  display.className = 'timer-display';
  display.textContent = formatTimeMMSS(totalSecondsInit);

  const btnStart = document.createElement('button');
  btnStart.className = 'btn btn-start';
  btnStart.textContent = 'Start';

  const btnPause = document.createElement('button');
  btnPause.className = 'btn btn-pause';
  btnPause.textContent = 'Pauze';

  const btnReset = document.createElement('button');
  btnReset.className = 'btn btn-reset';
  btnReset.textContent = 'Reset';

  let remaining = Math.max(1, Math.trunc(totalSecondsInit));
  let tickId = null;

  const updateDisplay = () => {
    display.textContent = formatTimeMMSS(remaining);
  };

  const start = () => {
    if (tickId) return; // al bezig
    root.dispatchEvent(new CustomEvent('task:timer:start'));
    tickId = setInterval(() => {
      remaining = Math.max(0, remaining - 1);
      updateDisplay();
      if (remaining === 0) {
        clearInterval(tickId);
        tickId = null;

        // TODO: playTimerEndSound();
        // Voorbeeld:
        // const audio = new Audio('media/timer_end.mp3'); audio.play().catch(()=>{});

        // TODO: enableCompleteButton();
        // Bijvoorbeeld:
        // document.querySelector('#task-complete')?.removeAttribute('disabled');

        root.dispatchEvent(new CustomEvent('task:timer:finish'));
      }
    }, 1000);
  };

  const pause = () => {
    if (!tickId) return;
    clearInterval(tickId);
    tickId = null;
    root.dispatchEvent(new CustomEvent('task:timer:pause'));
  };

  const reset = () => {
    pause();
    remaining = Math.max(1, Math.trunc(totalSecondsInit));
    updateDisplay();
    root.dispatchEvent(new CustomEvent('task:timer:reset'));
  };

  btnStart.addEventListener('click', start);
  btnPause.addEventListener('click', pause);
  btnReset.addEventListener('click', reset);

  root.append(display, btnStart, btnPause, btnReset);
  return root;
}

/**
 * Bouwt een uitvoerings-element op basis van task.execution
 * @param {Object} task - jouw task object met task.execution = { type, ... }
 * @returns {HTMLElement} - invoegbaar element (tekst of timer-UI)
 */
export function buildTaskExecutionElement(task) {
  const wrapper = document.createElement('div');
  wrapper.className = 'task-execution col';

  const exec = normalizeExecution(task?.execution);

  // once
  if (exec.type === 'once') {
    const span = document.createElement('span');
    span.className = 'exec-label';
    span.textContent = 'Eenmalige uitvoering';
    wrapper.appendChild(span);
    return wrapper;
  }

  // multiple
  if (exec.type === 'multiple') {
    const span = document.createElement('span');
    span.className = 'exec-label';
    // Optionele voortgangsweergave (placeholder; jouw code kan completedRuns updaten):
    const completed = Math.max(0, Math.trunc(task?.state?.completedRuns ?? 0));
    const total = exec.count;
    const text = completed > 0 ? `Uitvoering ${completed} van ${total}` : `Voer deze taak ${total} keer uit`;
    span.textContent = text;
    wrapper.appendChild(span);
    return wrapper;
  }

  // timer
  if (exec.type === 'timer') {
    const title = document.createElement('span');
    title.className = 'exec-label';
    // Toon ook de broninput (m en s) in kleine noot, handig voor debug
    title.textContent = 'Tijdgebonden uitvoering';

    const timerEl = createTimerElement(exec.totalSeconds);

    // Optional: luister op finish om meteen iets te doen vanuit de helper
    timerEl.addEventListener('task:timer:finish', () => {
      // TODO: enableCompleteButton();
      // document.querySelector('#task-complete')?.removeAttribute('disabled');
    });

    wrapper.append(title, timerEl);
    return wrapper;
  }

  // fallback
  const span = document.createElement('span');
  span.className = 'exec-label';
  span.textContent = 'Onbekende uitvoeringsmodus';
  wrapper.appendChild(span);
  return wrapper;
}
