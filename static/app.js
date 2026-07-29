let PLAN = [];
let dragSource = null; // { term, code }

function save() {
  fetch("/api/plan", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(PLAN),
  }).catch((err) => console.error("save failed", err));
  render(PLAN);
}

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

function closeEditor() {
  const backdrop = document.getElementById("editorBackdrop");
  if (backdrop) backdrop.remove();
}

// termIdx/courseIdx identify what we're editing; courseIdx === null means "add new course"
function openCourseEditor(termIdx, courseIdx) {
  const isNew = courseIdx === null;
  const course = isNew ? {} : PLAN[termIdx].courses[courseIdx];

  const backdrop = document.createElement("div");
  backdrop.className = "dialog-backdrop";
  backdrop.id = "editorBackdrop";
  backdrop.addEventListener("click", closeEditor);

  const dialog = document.createElement("div");
  dialog.className = "dialog";
  dialog.addEventListener("click", (e) => e.stopPropagation());

  const field = (label, id, value, placeholder) => `
    <div class="field">
      <label>${label}</label>
      <input class="input" id="${id}" value="${value ? String(value).replace(/"/g, "&quot;") : ""}" placeholder="${placeholder || ""}" />
    </div>
  `;

  dialog.innerHTML = `
    <span class="dialog-title">${isNew ? "Add course" : "Edit course"}</span>
    <div class="dialog-body" style="display:flex;flex-direction:column;gap:12px">
      <div style="display:flex;gap:12px">
        <div style="flex:1">${field("Code", "f-code", course.code, "e.g. M&I-ENG 443")}</div>
        <div style="flex:1"><label class="text-muted" style="font-size:12px">Credits</label>
          <input class="input" id="f-credits" type="number" value="${course.credits ?? 3}" /></div>
      </div>
      ${field("Title", "f-title", course.title, "Course title")}
      ${field("Note", "f-note", course.note, "optional")}
      <div style="display:flex;gap:12px">
        <div style="flex:1">${field("Req", "f-req", course.req, "optional")}</div>
        <div style="flex:1">${field("Co-req", "f-coreq", course.coreq, "optional")}</div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-end">
        <div style="flex:1">
          <label class="text-muted" style="font-size:12px">Offered</label>
          <select class="input" id="f-offered">
            <option value="">F/S (both)</option>
            <option value="F" ${course.offered === "F" ? "selected" : ""}>Fall only</option>
            <option value="S" ${course.offered === "S" ? "selected" : ""}>Spring only</option>
          </select>
        </div>
        <div style="flex:1">
          <label class="text-muted" style="font-size:12px">Elective</label>
          <select class="input" id="f-elective">
            <option value="">None</option>
            <option value="BME" ${course.elective === "BME" ? "selected" : ""}>BME</option>
            <option value="ME" ${course.elective === "ME" ? "selected" : ""}>ME</option>
          </select>
        </div>
        <label class="radio" style="padding-bottom:8px">
          <input type="checkbox" id="f-done" ${course.done ? "checked" : ""} style="position:static;opacity:1;width:auto;height:auto" />
          Done
        </label>
      </div>
    </div>
    <div class="dialog-actions">
      ${isNew ? "" : `<button class="btn btn-secondary" id="deleteCourseBtn" style="margin-right:auto;color:#e06868;border-color:#e06868">Delete</button>`}
      <button class="btn btn-secondary" id="cancelEditBtn">Cancel</button>
      <button class="btn btn-primary" id="saveEditBtn">Save</button>
    </div>
  `;

  backdrop.appendChild(dialog);
  document.querySelector(".noc-frame").appendChild(backdrop);

  document.getElementById("cancelEditBtn").addEventListener("click", closeEditor);

  document.getElementById("saveEditBtn").addEventListener("click", () => {
    const code = document.getElementById("f-code").value.trim();
    const title = document.getElementById("f-title").value.trim();
    if (!code || !title) return;
    const updated = {
      code,
      title,
      credits: Number(document.getElementById("f-credits").value) || 0,
      done: document.getElementById("f-done").checked,
    };
    const note = document.getElementById("f-note").value.trim();
    const req = document.getElementById("f-req").value.trim();
    const coreq = document.getElementById("f-coreq").value.trim();
    const offered = document.getElementById("f-offered").value;
    const elective = document.getElementById("f-elective").value;
    if (note) updated.note = note;
    if (req) updated.req = req;
    if (coreq) updated.coreq = coreq;
    if (offered) updated.offered = offered;
    if (elective) updated.elective = elective;

    if (isNew) {
      PLAN[termIdx].courses.push(updated);
    } else {
      PLAN[termIdx].courses[courseIdx] = updated;
    }
    closeEditor();
    save();
  });

  if (!isNew) {
    document.getElementById("deleteCourseBtn").addEventListener("click", () => {
      PLAN[termIdx].courses.splice(courseIdx, 1);
      closeEditor();
      save();
    });
  }
}

function addTerm() {
  const name = prompt("New term name (e.g. Summer 4):");
  if (!name || !name.trim()) return;
  PLAN.push({ term: name.trim(), courses: [] });
  save();
}

function deleteTerm(termIdx) {
  if (!confirm(`Delete "${PLAN[termIdx].term}" and all its courses?`)) return;
  PLAN.splice(termIdx, 1);
  save();
}

function buildTermCard(termData, termIdx) {
  const termCredits = termData.courses.reduce((s, c) => s + c.credits, 0);
  const isComplete = termData.courses.length > 0 && termData.courses.every((c) => c.done);
  let collapsed = isComplete || termData.term === "Spring 1";

  const termEl = document.createElement("div");
  termEl.className = "card elev-sm term-card" + (collapsed ? " collapsed" : "");

  const head = document.createElement("div");
  head.className = "term-head";
  head.innerHTML = `
    <span class="card-title" style="font-size:15px">${termData.term}</span>
    <div style="display:flex;align-items:center;gap:6px">
      <span class="text-muted" style="font-size:11px;white-space:nowrap">${termCredits} cr</span>
      <button class="btn btn-icon chevron-btn" style="width:22px;height:22px"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevron-icon"><path d="M9 18l6-6-6-6"></path></svg></button>
      <button class="btn btn-icon expand-btn" style="width:22px;height:22px"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"></path></svg></button>
      <button class="btn btn-icon delete-term-btn" style="width:22px;height:22px;color:#e06868" title="Delete term"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"></path></svg></button>
    </div>
  `;
  termEl.appendChild(head);

  head.querySelector(".expand-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    openExpand(termData, termCredits);
  });
  head.querySelector(".delete-term-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    deleteTerm(termIdx);
  });

  const courses = document.createElement("div");
  courses.className = "term-dropzone";
  courses.style.cssText = "display:flex;flex-direction:column;gap:4px;margin-top:2px;min-height:8px";
  if (collapsed) courses.style.display = "none";

  courses.addEventListener("dragover", (e) => {
    e.preventDefault();
    courses.classList.add("drag-over");
  });
  courses.addEventListener("dragleave", () => courses.classList.remove("drag-over"));
  courses.addEventListener("drop", (e) => {
    e.preventDefault();
    courses.classList.remove("drag-over");
    if (!dragSource) return;
    const srcTerm = PLAN.find((t) => t.term === dragSource.term);
    const srcIdx = srcTerm.courses.findIndex((c) => c === dragSource.courseRef);
    if (srcIdx === -1) return;
    const [moved] = srcTerm.courses.splice(srcIdx, 1);
    PLAN[termIdx].courses.push(moved);
    dragSource = null;
    save();
  });

  termData.courses.forEach((course, courseIdx) => {
    const row = document.createElement("div");
    row.className = "card course-card";
    row.draggable = true;
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
    row.addEventListener("click", () => openCourseEditor(termIdx, courseIdx));
    row.addEventListener("dragstart", (e) => {
      dragSource = { term: termData.term, courseRef: course };
      e.dataTransfer.effectAllowed = "move";
      row.classList.add("dragging");
    });
    row.addEventListener("dragend", () => row.classList.remove("dragging"));
    courses.appendChild(row);
  });

  const addBtn = document.createElement("button");
  addBtn.className = "btn btn-secondary btn-block";
  addBtn.style.cssText = "justify-content:center;margin-top:4px;font-size:12px;padding:4px";
  addBtn.textContent = "+ Add course";
  addBtn.addEventListener("click", () => openCourseEditor(termIdx, null));
  courses.appendChild(addBtn);

  const chevronBtn = head.querySelector(".chevron-btn");
  const chevronIcon = chevronBtn.querySelector(".chevron-icon");
  chevronIcon.style.transform = collapsed ? "rotate(0deg)" : "rotate(90deg)";
  chevronIcon.style.transition = "transform .15s ease";
  chevronBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    collapsed = !collapsed;
    courses.style.display = collapsed ? "none" : "flex";
    chevronIcon.style.transform = collapsed ? "rotate(0deg)" : "rotate(90deg)";
    termEl.classList.toggle("collapsed", collapsed);
  });

  termEl.appendChild(courses);
  return { termEl, termCredits };
}

function render(plan) {
  PLAN = plan;
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

  if (stackTerms.some((t) => PLAN.some((p) => p.term === t))) {
    const stack = document.createElement("div");
    stack.className = "term-stack";
    stack.style.cssText = "display:flex;flex-direction:column;gap:12px";
    PLAN.forEach((termData, termIdx) => {
      if (!stackTerms.includes(termData.term)) return;
      const { termEl } = buildTermCard(termData, termIdx);
      stack.appendChild(termEl);
    });
    grid.appendChild(stack);
  }

  PLAN.forEach((termData, termIdx) => {
    if (stackTerms.includes(termData.term)) return;
    const { termEl } = buildTermCard(termData, termIdx);
    grid.appendChild(termEl);
  });

  const addTermBtn = document.createElement("button");
  addTermBtn.className = "btn btn-secondary";
  addTermBtn.style.cssText = "flex-shrink:0; align-self:flex-start; white-space:nowrap;";
  addTermBtn.textContent = "+ Add term";
  addTermBtn.addEventListener("click", addTerm);
  grid.appendChild(addTermBtn);

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
