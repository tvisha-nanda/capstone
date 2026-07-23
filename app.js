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

function render(PLAN) {
  const checked = loadChecked();
  const timeline = document.getElementById("timeline");
  timeline.innerHTML = "";

  let totalCredits = 0;
  let doneCredits = 0;

  PLAN.forEach((termData, idx) => {
    const termEl = document.createElement("div");
    termEl.className = "term";
    if (termData.status === "complete") termEl.classList.add("complete");

    const termCredits = termData.courses.reduce((s, c) => s + c.credits, 0);
    let termDone = 0;

    const head = document.createElement("div");
    head.className = "term-head";
    head.innerHTML = `
      <div>
        <span class="term-name">${termData.term}</span>
      </div>
      <div class="term-meta">
        <span>${termCredits} cr</span>
        <span class="chevron">&#9656;</span>
      </div>
    `;
    head.addEventListener("click", () => {
      termEl.classList.toggle("open");
    });

    const body = document.createElement("div");
    body.className = "term-body";

    termData.courses.forEach((course) => {
      const id = courseId(termData.term, course.code);
      const isChecked = termData.status === "complete" ? true : (checked[id] ?? course.done);

      totalCredits += course.credits;
      if (isChecked) {
        doneCredits += course.credits;
        termDone += course.credits;
      }

      const row = document.createElement("div");
      row.className = "course-row";
      row.innerHTML = `
        <input type="checkbox" ${isChecked ? "checked" : ""} ${termData.status === "complete" ? "disabled" : ""} />
        <div>
          <div class="course-title ${isChecked ? "checked" : ""}">${course.title}${course.note ? ` <span class="note">— ${course.note}</span>` : ""}</div>
        </div>
        <span class="course-code">${course.code}</span>
        <span class="course-credits">${course.credits}cr</span>
      `;
      const box = row.querySelector("input");
      box.addEventListener("change", (e) => {
        const state = loadChecked();
        state[id] = e.target.checked;
        saveChecked(state);
        render(PLAN);
      });
      body.appendChild(row);
    });

    if (idx === PLAN.findIndex(t => t.status !== "complete")) {
      termEl.classList.add("open");
    }

    termEl.appendChild(head);
    termEl.appendChild(body);
    timeline.appendChild(termEl);
  });

  const pct = totalCredits ? Math.round((doneCredits / totalCredits) * 100) : 0;
  document.getElementById("progressFill").style.width = pct + "%";
  document.getElementById("progressText").textContent =
    `${doneCredits} / ${totalCredits} credits checked off (${pct}%)`;
}

fetch("/api/plan")
  .then((res) => res.json())
  .then((plan) => render(plan))
  .catch((err) => {
    document.getElementById("timeline").textContent = "Failed to load plan data.";
    console.error(err);
  });
