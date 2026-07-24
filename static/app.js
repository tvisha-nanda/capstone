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
      <div style="display:flex;justify-content:space-between;align-items:baseline;gap:6px">
        <span style="display:flex;align-items:center;gap:6px">
          ${course.elective ? `<span title="${course.elective} technical elective" style="width:6px;height:6px;border-radius:50%;background:#e0a458;flex:none"></span>` : ""}
          <span class="card-title" style="font-size:16px">${course.code}</span>
        </span>
        <span style="display:flex;align-items:center;gap:6px">
          ${course.offered ? `<span class="tag tag-neutral" style="padding:2px 6px">${course.offered}</span>` : ""}
          <span class="text-muted" style="font-size:12px">${course.credits} cr</span>
        </span>
      </div>
      <div class="card-body">${course.title}</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        ${course.note ? `<span class="tag tag-neutral">${course.note}</span>` : ""}
        ${course.req ? `<span class="tag tag-outline">REQ: ${course.req}</span>` : ""}
        ${course.coreq ? `<span class="tag tag-accent">CO-REQ: ${course.coreq}</span>` : ""}
      </div>
    `;
    grid.appendChild(card);
  });
  dialog.appendChild(grid);

  backdrop.appendChild(dialog);
  document.querySelector(".noc-frame").appendChild(backdrop);
  document.getElementById("closeExpandBtn").addEventListener("click", closeExpand);
  document.addEventListener("keydown", onExpandKeydown);
}

function buildTermCard(termData) {
  const termCredits = termData.courses.reduce((s, c) => s + c.credits, 0);
  const isComplete = termData.courses.every((c) => c.done);
  let collapsed = isComplete || termData.term === "Spring 1";

  const termEl = document.createElement("div");
  termEl.className = "card elev-sm term-card";

  const head = document.createElement("div");
  head.className = "term-head";
  head.innerHTML = `
    <span class="card-title" style="font-size:15px">${termData.term}</span>
    <div style="display:flex;align-items:center;gap:6px">
      <span class="text-muted" style="font-size:11px;white-space:nowrap">${termCredits} cr</span>
      <button class="btn btn-icon chevron-btn" style="width:22px;height:22px"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevron-icon"><path d="M9 18l6-6-6-6"></path></svg></button>
      <button class="btn btn-icon expand-btn" style="width:22px;height:22px"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"></path></svg></button>
    </div>
  `;
  termEl.appendChild(head);

  head.querySelector(".expand-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    openExpand(termData, termCredits);
  });

  const courses = document.createElement("div");
  courses.style.cssText = "display:flex;flex-direction:column;gap:4px;margin-top:2px";
  if (collapsed) courses.style.display = "none";

  termData.courses.forEach((course) => {
    const row = document.createElement("div");
    row.className = "card course-card";
    row.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px">
        <div style="display:flex;align-items:center;gap:5px">
          ${course.elective ? `<span title="${course.elective} technical elective" style="width:6px;height:6px;border-radius:50%;background:#e0a458;flex:none"></span>` : ""}
          <div style="font-size:13px;font-weight:500" class="course-title ${course.done ? "checked" : ""}">${course.code}</div>
        </div>
        <span style="display:flex;align-items:center;gap:5px">
          ${course.offered ? `<span class="tag tag-neutral" style="padding:1px 5px;font-size:10px">${course.offered}</span>` : ""}
          <span class="text-muted" style="font-size:11px;white-space:nowrap">${course.credits} cr</span>
        </span>
      </div>
      <div class="text-muted" style="font-size:12px">${course.title}</div>
      <div class="course-meta text-muted">
        ${course.note ? `<span class="tag tag-neutral">${course.note}</span>` : ""}
        ${course.req ? `<span class="tag tag-outline">REQ: ${course.req}</span>` : ""}
        ${course.coreq ? `<span class="tag tag-accent">CO-REQ: ${course.coreq}</span>` : ""}
      </div>
    `;
    courses.appendChild(row);
  });

  const chevronBtn = head.querySelector(".chevron-btn");
  const chevronIcon = chevronBtn.querySelector(".chevron-icon");
  chevronIcon.style.transform = collapsed ? "rotate(0deg)" : "rotate(90deg)";
  chevronIcon.style.transition = "transform .15s ease";
  chevronBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    collapsed = !collapsed;
    courses.style.display = collapsed ? "none" : "flex";
    chevronIcon.style.transform = collapsed ? "rotate(0deg)" : "rotate(90deg)";
  });

  termEl.appendChild(courses);
  return { termEl, termCredits };
}

function render(PLAN) {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  let totalCredits = 0;
  let doneCredits = 0;
  const electiveStats = {
    BME: { count: 0, credits: 0, required: 5, requiredCredits: 15 },
    ME: { count: 0, credits: 0, required: 4, requiredCredits: 12 },
  };

  PLAN.forEach((termData) => {
    termData.courses.forEach((course) => {
      totalCredits += course.credits;
      if (course.done) doneCredits += course.credits;
      const isPastOrCurrent = course.done || termData.term === "Fall 2";
      if (course.elective && electiveStats[course.elective] && isPastOrCurrent) {
        electiveStats[course.elective].count += 1;
        electiveStats[course.elective].credits += course.credits;
      }
    });
  });

  ["BME", "ME"].forEach((major) => {
    const s = electiveStats[major];
    const pct = Math.min(100, Math.round((s.count / s.required) * 100));
    const over = s.count > s.required;
    document.getElementById(`${major.toLowerCase()}ElectiveText`).textContent = `${s.count}/${s.required}`;
    document.getElementById(`${major.toLowerCase()}ElectiveCr`).textContent = `${s.credits}/${s.requiredCredits} cr`;
    const fill = document.getElementById(`${major.toLowerCase()}ElectiveFill`);
    fill.style.width = pct + "%";
    fill.classList.toggle("over", over);
  });

  const stackTerms = ["Fall 1", "Spring 1", "Summer 1 (transfer)"];
  const stacked = PLAN.filter((t) => stackTerms.includes(t.term));
  const rest = PLAN.filter((t) => !stackTerms.includes(t.term));

  if (stacked.length) {
    const stack = document.createElement("div");
    stack.style.cssText = "display:flex;flex-direction:column;gap:12px";
    stacked.forEach((termData) => {
      const { termEl } = buildTermCard(termData);
      stack.appendChild(termEl);
    });
    grid.appendChild(stack);
  }

  rest.forEach((termData) => {
    const { termEl } = buildTermCard(termData);
    grid.appendChild(termEl);
  });

  const pct = totalCredits ? Math.round((doneCredits / totalCredits) * 100) : 0;
  document.getElementById("navCreditText").textContent = `${doneCredits} / ${totalCredits} cr`;

  const ringCircumference = 97.4;
  document.getElementById("degreeRingFill").setAttribute(
    "stroke-dasharray",
    `${(pct / 100) * ringCircumference} ${ringCircumference}`
  );
  document.getElementById("navDegreePct").textContent = pct + "%";
}

fetch("/api/plan")
  .then((res) => res.json())
  .then((plan) => render(plan))
  .catch((err) => {
    document.getElementById("grid").textContent = "Failed to load plan data.";
    console.error(err);
  });
