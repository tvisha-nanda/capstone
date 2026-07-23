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

function render(PLAN) {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  let totalCredits = 0;
  let doneCredits = 0;

  PLAN.forEach((termData) => {
    const termCredits = termData.courses.reduce((s, c) => s + c.credits, 0);
    const isCollapsed = termData.status === "complete";

    termData.courses.forEach((course) => {
      totalCredits += course.credits;
      if (termData.status === "complete" || course.done) doneCredits += course.credits;
    });

    const termEl = document.createElement("div");
    termEl.className = "card elev-sm term-card" + (isCollapsed ? " collapsed" : "");

    const head = document.createElement("div");
    head.className = "term-head";
    head.style.cursor = "pointer";
    head.innerHTML = `
      <span class="card-title" style="font-size:15px">${termData.term}</span>
      <div style="display:flex;align-items:center;gap:8px">
        <span class="text-muted" style="font-size:11px;white-space:nowrap">${termCredits} cr</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"></path></svg>
      </div>
    `;
    head.addEventListener("click", () => openExpand(termData, termCredits));
    termEl.appendChild(head);

    if (!isCollapsed) {
      const courses = document.createElement("div");
      courses.style.cssText = "display:flex;flex-direction:column;gap:6px;margin-top:2px";

      termData.courses.forEach((course) => {
        const row = document.createElement("div");
        row.className = "card course-card";
        row.innerHTML = `
          <div style="font-size:13px;font-weight:500" class="course-title ${course.done ? "checked" : ""}">${course.code}</div>
          <div class="text-muted" style="font-size:12px">${course.title}</div>
          <div class="course-meta text-muted">
            <span>${course.credits} cr</span>
            ${course.note ? `<span class="tag tag-neutral">${course.note}</span>` : ""}
            ${course.req ? `<span class="tag tag-outline">REQ: ${course.req}</span>` : ""}
            ${course.coreq ? `<span class="tag tag-accent">CO-REQ: ${course.coreq}</span>` : ""}
          </div>
        `;
        courses.appendChild(row);
      });

      termEl.appendChild(courses);
    }

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
