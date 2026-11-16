// Section options popover: hover a term title (e.g. "Fall 3") to see every
// section option for the courses currently in that term, read from
// schedules.json. Sections that collide with a fixed meeting are flagged.
// Works off app.js's global PLAN; app.js needs no changes.

let SCHEDULES = {};
let popEl = null;
let hideTimer = null;

fetch("/schedules.json")
  .then((r) => r.json())
  .then((d) => { SCHEDULES = d; markTitles(); })
  .catch((err) => console.error("schedules load failed", err));

const normCode = (code) => code.replace(/\+$/, "").trim();
const toMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
const fmt = (t) => {
  let [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  if (h > 12) h -= 12;
  return `${h}:${String(m).padStart(2, "0")} ${ampm}`;
};
const overlaps = (a, b) =>
  a.days.some((d) => b.days.includes(d)) &&
  toMin(a.start) < toMin(b.end) && toMin(b.start) < toMin(a.end);

// Collect sections for the courses in this term, tagged with course + component.
function termSections(termData, sched) {
  const out = [];
  termData.courses.forEach((c) => {
    const code = normCode(c.code);
    (sched.courses[code] || []).forEach((s) => out.push({ ...s, code }));
  });
  return out;
}

function clashesFor(sec, all) {
  // Fixed = the only option for its course + component, so it has to be taken.
  const isFixed = (s) => all.filter((o) => o.code === s.code && o.type === s.type).length === 1;
  return all
    .filter((o) => o !== sec && o.code !== sec.code)
    .filter((o) => isFixed(o) || (sec.pick && o.pick))
    .filter((o) => overlaps(sec, o))
    .map((o) => `${o.code} ${o.type === "LEC" ? "" : o.type.toLowerCase()}`.trim());
}

function buildPopover(termData) {
  const sched = SCHEDULES[termData.term];
  const all = termSections(termData, sched);

  const el = document.createElement("div");
  el.className = "sched-pop";
  let html = `
    <div class="sched-pop-head">
      <span class="card-title" style="font-size:14px">${sched.label} section options</span>
    </div>
    <div class="text-muted" style="font-size:11px">${sched.source}</div>
  `;

  termData.courses.forEach((c) => {
    const code = normCode(c.code);
    const secs = all.filter((s) => s.code === code);
    html += `<div class="sched-course">
      <div class="sched-course-head"><span>${c.code}</span><span class="text-muted">${c.title}</span></div>`;
    if (!secs.length) {
      html += `<div class="text-muted sched-empty">No section data yet</div>`;
    } else {
      secs.forEach((s) => {
        const clash = clashesFor(s, all);
        let status = `<span class="sched-status open">Open</span>`;
        if (clash.length) status = `<span class="sched-status clash">Clashes: ${clash.join(", ")}</span>`;
        else if (s.pick) status = `<span class="sched-status pick">Your pick</span>`;
        html += `<div class="sched-row${clash.length ? " is-clash" : ""}${s.pick ? " is-pick" : ""}">
          <span class="sched-sec">${s.sec}</span>
          <span class="sched-type">${s.type}</span>
          <span class="sched-days">${s.days.join("")}</span>
          <span class="sched-time">${fmt(s.start)} to ${fmt(s.end)}</span>
          ${status}
        </div>`;
      });
    }
    html += `</div>`;
  });

  el.innerHTML = html;
  el.addEventListener("mouseenter", () => clearTimeout(hideTimer));
  el.addEventListener("mouseleave", scheduleHide);
  return el;
}

function showPopover(titleEl, termName) {
  const termData = PLAN.find((t) => t.term === termName);
  if (!termData || !SCHEDULES[termName]) return;
  clearTimeout(hideTimer);
  hidePopover();
  popEl = buildPopover(termData);
  document.querySelector(".noc-frame").appendChild(popEl);

  const r = titleEl.getBoundingClientRect();
  const w = popEl.offsetWidth;
  const left = Math.min(r.left, window.innerWidth - w - 12);
  popEl.style.left = Math.max(12, left) + "px";
  popEl.style.top = r.bottom + 6 + "px";
}

function hidePopover() {
  if (popEl) popEl.remove();
  popEl = null;
}

function scheduleHide() {
  clearTimeout(hideTimer);
  hideTimer = setTimeout(hidePopover, 150);
}

// Underline titles of terms that have schedule data so the hover is discoverable.
function markTitles() {
  document.querySelectorAll(".term-head .card-title").forEach((t) => {
    t.classList.toggle("has-sched", !!SCHEDULES[t.textContent.trim()]);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("grid");
  new MutationObserver(markTitles).observe(grid, { childList: true });

  grid.addEventListener("mouseover", (e) => {
    const title = e.target.closest(".term-head .card-title");
    if (!title) return;
    const name = title.textContent.trim();
    if (popEl && popEl.dataset.term === name) { clearTimeout(hideTimer); return; }
    showPopover(title, name);
    if (popEl) popEl.dataset.term = name;
  });
  grid.addEventListener("mouseout", (e) => {
    if (e.target.closest(".term-head .card-title")) scheduleHide();
  });
  window.addEventListener("scroll", (e) => {
    if (popEl && popEl.contains(e.target)) return;
    hidePopover();
  }, true);
});
