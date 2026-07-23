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
    head.innerHTML = `
      <span class="card-title" style="font-size:15px">${termData.term}</span>
      <span class="tag ${STATUS_TAG[termData.status]}">${STATUS_LABEL[termData.status]}</span>
    `;
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
