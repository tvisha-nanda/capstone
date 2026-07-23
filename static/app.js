const STORAGE_KEY = "degree-plan-checked-v1";

function loadChecked() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}
function saveChecked(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function courseId(term, code) {
  return `${term}__${code}`;
}

const STATUS_TAG = {
  complete: "tag-accent",
  "in-progress": "tag-outline",
  planned: "tag-neutral",
};
const STATUS_LABEL = {
  complete: "Completed",
  "in-progress": "In progress",
  planned: "Planning",
};

function closeExpand() {
  const backdrop = document.getElementById("expandBackdrop");
  if (backdrop) backdrop.remove();
  document.removeEventListener("keydown", onExpandKeydown);
}

function onExpandKeydown(e) {
  if (e.key === "Escape") closeExpand();
}

function openExpand(termData, termCredits) {
  const backdrop = document.createElement("div");
  backdrop.className = "dialog-backdrop";
  backdrop.id = "expandBackdrop";
  backdrop.addEventListener("click", closeExpand);

  const dialog = document.createElement("div");
  dialog.className = "dialog";
  dialog.style.width = "min(960px, 95vw)";
  dialog.addEventListener("click", (e) => e.stopPropagation());

  const header = document.createElement("div");
  header.style.cssText = "display:flex;justify-content:space-between;align-items:baseline";
  header.innerHTML = `
    <span class="dialog-title">${termData.term}</span>
    <button class="btn btn-ghost" id="closeExpandBtn">Close</button>
  `;
  dialog.appendChild(header);

  const meta = document.createElement("div");
  meta.className = "text-muted";
  meta.style.cssText = "font-size:13px;margin-top:-8px";
  meta.textContent = `${termCredits} credits`;
  dialog.appendChild(meta);

  const grid = document.createElement("div");
  grid.style.cssText = "display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:4px;max-height:70vh;overflow:auto";

  termData.courses.forEach((course) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.cssText = "background:var(--color-bg);border:1px solid var(--color-divider);gap:8px";
    card.innerHTML = `
      <span class="card-title" style="font-size:16px">${course.code}</span>
      <div class="card-body">${course.title}</div>
      <div class="card-meta">${course.credits} credits</div>
      ${course.note ? `<div><span class="tag tag-outline">${course.note}</span></div>` : ""}
    `;
    grid.appendChild(card);
  });
  dialog.appendChild(grid);

  backdrop.appendChild(dialog);
  document.querySelector(".noc-frame").appendChild(backdrop);
  document.getElementById("closeExpandBtn").addEventListener("click", closeExpand);
  document.addEventListener("keydown", onExpandKeydown);
}

function render(PLAN) {
  const checked = loadChecked();
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  let totalCredits = 0;
  let doneCredits = 0;

  PLAN.forEach((termData) => {
    const termCredits = termData.courses.reduce((s, c) => s + c.credits, 0);

    const termEl = document.createElement("div");
    termEl.className = "card elev-sm";

    const head = document.createElement("div");
    head.className = "term-head";
    head.style.cursor = "pointer";
    head.innerHTML = `
      <span class="card-title" style="font-size:15px">${termData.term}</span>
      <div style="display:flex;align-items:center;gap:8px">
        <span class="tag ${STATUS_TAG[termData.status]}">${STATUS_LABEL[termData.status]}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"></path></svg>
      </div>
    `;
    head.addEventListener("click", () => openExpand(termData, termCredits));
    termEl.appendChild(head);

    const meta = document.createElement("div");
    meta.className = "card-meta";
    meta.textContent = `${termCredits} credits`;
    termEl.appendChild(meta);

    const courses = document.createElement("div");
    courses.style.cssText = "display:flex;flex-direction:column;gap:6px;margin-top:2px";

    termData.courses.forEach((course) => {
      const id = courseId(termData.term, course.code);
      const isChecked = termData.status === "complete" ? true : (checked[id] ?? course.done);

      totalCredits += course.credits;
      if (isChecked) doneCredits += course.credits;

      const row = document.createElement("div");
      row.className = "card course-card";
      row.innerHTML = `
        <div class="course-row">
          <input type="checkbox" ${isChecked ? "checked" : ""} ${termData.status === "complete" ? "disabled" : ""} />
          <div style="flex:1">
            <div style="font-size:13px;font-weight:500" class="course-title ${isChecked ? "checked" : ""}">${course.code}</div>
            <div class="text-muted" style="font-size:12px">${course.title}</div>
            <div class="course-meta text-muted">
              <span>${course.credits} cr</span>
              ${course.note ? `<span class="tag tag-outline">${course.note}</span>` : ""}
            </div>
          </div>
        </div>
      `;
      const box = row.querySelector("input");
      box.addEventListener("change", (e) => {
        const state = loadChecked();
        state[id] = e.target.checked;
        saveChecked(state);
        render(PLAN);
      });
      courses.appendChild(row);
    });

    termEl.appendChild(courses);
    grid.appendChild(termEl);
  });

  const pct = totalCredits ? Math.round((doneCredits / totalCredits) * 100) : 0;
  document.getElementById("progressFill").style.width = pct + "%";
  document.getElementById("progressPct").textContent = pct + "%";
  document.getElementById("progressText").textContent = `${doneCredits} / ${totalCredits} credits`;
}

fetch("/api/plan")
  .then((res) => res.json())
  .then((plan) => render(plan))
  .catch((err) => {
    document.getElementById("grid").textContent = "Failed to load plan data.";
    console.error(err);
  });
