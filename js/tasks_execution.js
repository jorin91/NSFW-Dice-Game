import { setI18n } from "./lang_i18n.js";

/* Notatie: task.flags.execution = { type: 'once' | 'multiple' | 'timer', ...opts } */
function normalizeExecution(execution) {
  const type = (execution?.type ?? "once").toLowerCase();

  if (type === "multiple") {
    const raw = execution?.count;
    let count = Number.isFinite(raw) ? Math.trunc(raw) : 3;
    if (count < 1) count = 1;
    return { type: "multiple", count };
  }

  if (type === "timer") {
    const m = Number.isFinite(execution?.minutes)
      ? Math.trunc(execution.minutes)
      : 0;
    const s = Number.isFinite(execution?.seconds)
      ? Math.trunc(execution.seconds)
      : 60;
    let total = Math.max(0, m * 60 + s);
    if (total === 0) total = 1; // voorkom 0s
    return { type: "timer", totalSeconds: total, minutes: m, seconds: s };
  }

  return { type: "once" };
}

function formatTimeMMSS(totalSeconds) {
  const sec = Math.max(0, Math.trunc(totalSeconds));
  const mm = Math.floor(sec / 60);
  const ss = sec % 60;
  return `${mm}:${String(ss).padStart(2, "0")}`;
}

/* Timer-UI met i18n-keys op header/knoppen */
function createTimerElement(
  totalSecondsInit = 60,
  src = { minutes: 0, seconds: 60 }
) {
  // Element
  const root = document.createElement("div");
  root.className = "timer col centerWrap centerContent";

  const header = document.createElement("h4");
  setI18n(header, "app.task.exec.timer.header"); // "Tijdgebonden uitvoering"

  const hint = document.createElement("p");
  setI18n(hint, "app.task.exec.timer.hint", {
    mm: Math.trunc(src.minutes ?? 0),
    ss: Math.trunc(src.seconds ?? 0),
  }); // "Ingesteld op {mm}m {ss}s"

  const row = document.createElement("div");
  row.className = "row";

  const display = document.createElement("span");
  display.className = "timer-display";
  // display-tekst is numeriek, maar we geven een i18n-label mee voor toegankelijkheid
  // setI18n(display, "app.task.exec.timer.display.label"); // "Tijd"
  display.textContent = formatTimeMMSS(totalSecondsInit);

  const btnStart = document.createElement("button");
  btnStart.className = "btn btn-start";
  setI18n(btnStart, "app.task.exec.timer.btn.start"); // "Start"

  const btnPause = document.createElement("button");
  btnPause.className = "btn btn-pause";
  setI18n(btnPause, "app.task.exec.timer.btn.pause"); // "Pauze"

  const btnReset = document.createElement("button");
  btnReset.className = "btn btn-reset";
  setI18n(btnReset, "app.task.exec.timer.btn.reset"); // "Reset"

  let remaining = Math.max(1, Math.trunc(totalSecondsInit));
  let tickId = null;

  const updateDisplay = () => {
    display.textContent = formatTimeMMSS(remaining);
  };

  const start = () => {
    if (tickId) return;
    root.dispatchEvent(new CustomEvent("task:timer:start"));
    tickId = setInterval(() => {
      remaining = Math.max(0, remaining - 1);
      updateDisplay();
      if (remaining === 0) {
        clearInterval(tickId);
        tickId = null;

        // TODO: playTimerEndSound();
        // const audio = new Audio('media/timer_end.mp3'); audio.play().catch(()=>{});

        // TODO: enableCompleteButton();
        // document.querySelector('#task-complete')?.removeAttribute('disabled');

        root.dispatchEvent(new CustomEvent("task:timer:finish"));
      }
    }, 1000);
  };

  const pause = () => {
    if (!tickId) return;
    clearInterval(tickId);
    tickId = null;
    root.dispatchEvent(new CustomEvent("task:timer:pause"));
  };

  const reset = () => {
    pause();
    remaining = Math.max(1, Math.trunc(totalSecondsInit));
    updateDisplay();
    root.dispatchEvent(new CustomEvent("task:timer:reset"));
  };

  btnStart.addEventListener("click", start);
  btnPause.addEventListener("click", pause);
  btnReset.addEventListener("click", reset);

  row.append(btnStart, btnPause, btnReset);
  root.append(header, hint, display, row);
  return root;
}

/**
 * Bouwt een uitvoerings-element op basis van task.execution (i18n-ready).
 * - once  -> header + label
 * - multiple -> header + label (met {count}) of voortgang (met {completed}/{total})
 * - timer -> header + hint + display + knoppen
 */
export function buildTaskExecutionElement(task) {
  const wrapper = document.createElement("section");
  wrapper.className = "task-execution col small";

  const exec = normalizeExecution(task?.flags?.execution);

  // Algemene header
  const header = document.createElement("h4");
  setI18n(header, "app.task.exec.header"); // "Uitvoering"
  wrapper.appendChild(header);

  if (exec.type === "once") {
    const text = document.createElement("p");
    setI18n(text, "app.task.exec.once.label"); // "Eenmalige uitvoering"
    wrapper.appendChild(text);
    return wrapper;
  }

  if (exec.type === "multiple") {
    const completed = Math.max(0, Math.trunc(task?.state?.completedRuns ?? 0));
    const total = exec.count;

    const text = document.createElement("p");
    if (completed > 0) {
      // "Uitvoering {completed} van {total}"
      setI18n(text, "app.task.exec.multiple.progress", { completed, total });
    } else {
      // "Voer deze taak {count} keer uit"
      setI18n(text, "app.task.exec.multiple.label", { count: total });
    }
    wrapper.appendChild(text);
    return wrapper;
  }

  if (exec.type === "timer") {
    const timerEl = createTimerElement(exec.totalSeconds, {
      minutes: exec.minutes ?? 0,
      seconds: exec.seconds ?? 0,
    });

    // Optioneel: interop met jouw paneel
    timerEl.addEventListener("task:timer:finish", () => {
      // TODO: enableCompleteButton();
    });

    wrapper.appendChild(timerEl);
    return wrapper;
  }

  const fallback = document.createElement("p");
  setI18n(fallback, "app.task.exec.unknown"); // "Onbekende uitvoeringsmodus"
  wrapper.appendChild(fallback);
  return wrapper;
}
