// Populates the hero "live example" snapshot on the landing page from the
// same /api/plan endpoint the dashboard uses.
fetch("/api/plan")
  .then((res) => res.json())
  .then((plan) => {
    let totalCredits = 0;
    let doneCredits = 0;
    const electiveStats = {
      BME: { count: 0, required: 5 },
      ME: { count: 0, required: 4 },
    };

    plan.forEach((termData) => {
      termData.courses.forEach((course) => {
        totalCredits += course.credits;
        if (course.done) doneCredits += course.credits;
        const isPastOrCurrent = course.done || termData.term === "Fall 2";
        if (course.elective && electiveStats[course.elective] && isPastOrCurrent) {
          electiveStats[course.elective].count += 1;
        }
      });
    });

    const pct = totalCredits ? Math.round((doneCredits / totalCredits) * 100) : 0;
    const ringCircumference = 97.4;
    document.getElementById("heroRingFill").setAttribute(
      "stroke-dasharray",
      `${(pct / 100) * ringCircumference} ${ringCircumference}`
    );
    document.getElementById("heroPct").textContent = pct + "%";
    document.getElementById("heroCredits").textContent = `${doneCredits} / ${totalCredits} credits`;

    ["BME", "ME"].forEach((major) => {
      const s = electiveStats[major];
      const p = Math.min(100, Math.round((s.count / s.required) * 100));
      document.getElementById(`hero${major === "BME" ? "Bme" : "Me"}Text`).textContent = `${s.count}/${s.required}`;
      document.getElementById(`hero${major === "BME" ? "Bme" : "Me"}Fill`).style.width = p + "%";
    });
  })
  .catch((err) => console.error("Failed to load plan snapshot:", err));
