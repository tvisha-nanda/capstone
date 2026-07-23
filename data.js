// Edit this file to update your plan — no need to touch index.html or app.js
const PLAN = [
  {
    term: "Fall 2025",
    status: "complete",
    courses: [
      { code: "MATH 131", title: "Calculus I", credits: 4, done: true },
      { code: "MATH 132", title: "Calculus II", credits: 4, done: true },
      { code: "MATH 233", title: "Multivariate Calculus", credits: 4, done: true },
      { code: "CHEM 111", title: "Chemistry I", credits: 4, done: true },
      { code: "PHYSICS 151", title: "General Physics I", credits: 4, done: true },
      { code: "ENGIN 114", title: "Intro to BME", credits: 3, done: true },
      { code: "ENGLWRIT 112", title: "College Writing", credits: 3, done: true },
      { code: "HISTORY 151", title: "US History since 1876", credits: 3, done: true },
      { code: "PSYCH 100", title: "Introductory Psychology", credits: 4, done: true },
      { code: "E&C-ENG 150", title: "Better Decisions by Humans & AI", credits: 4, done: true },
    ],
  },
  {
    term: "Spring 2026",
    status: "complete",
    courses: [
      { code: "CHEM 112", title: "Chemistry II", credits: 4, done: true },
      { code: "PHYSICS 152", title: "General Physics II", credits: 4, done: true },
      { code: "M&I-ENG 201", title: "Intro to Materials Science", credits: 3, done: true },
      { code: "M&I-ENG 210", title: "Statics", credits: 3, done: true },
      { code: "M&I-ENG 273", title: "Probability & Statistics for Engineers", credits: 3, done: true },
      { code: "HM&FNART 102", title: "Traversing Differences: Global", credits: 4, done: true, note: "resolving INC — 1 assignment left" },
    ],
  },
  {
    term: "Fall 2026",
    status: "in-progress",
    courses: [
      { code: "BMED-ENG 210", title: "Intro to Biology for Engineers", credits: 4, done: false },
      { code: "M&I-ENG 124", title: "Computational Approaches to Engineering", credits: 3, done: false },
      { code: "M&I-ENG 302", title: "ME Lab I", credits: 3, done: false },
      { code: "M&I-ENG 310", title: "Dynamics", credits: 3, done: false },
      { code: "M&I-ENG 340", title: "Fluid Mechanics I", credits: 3, done: false },
    ],
  },
  {
    term: "Summer 2026 (transfer)",
    status: "in-progress",
    courses: [
      { code: "M&I-ENG 211", title: "Strength of Materials", credits: 3, done: false, note: "also satisfies BMED-ENG 241 — send transcript ASAP" },
      { code: "M&I-ENG 230", title: "Thermodynamics", credits: 3, done: false, note: "send transcript ASAP" },
      { code: "MATH 331", title: "Differential Equations", credits: 3, done: false, note: "send transcript ASAP" },
    ],
  },
  {
    term: "Spring 2027",
    status: "planned",
    courses: [
      { code: "KIN 270", title: "Anatomy & Physiology I", credits: 4, done: false },
      { code: "GEN ED", title: "Arts & Literature elective", credits: 4, done: false },
      { code: "BMED-ENG 275", title: "Biomechanics", credits: 3, done: false, note: "needs 211/241 transfer posted" },
      { code: "BMED-ENG 300", title: "Biomaterials", credits: 3, done: false },
      { code: "BMED-ENG 310", title: "Intro Lab Techniques", credits: 3, done: false },
    ],
  },
  {
    term: "Summer 2027",
    status: "planned",
    courses: [
      { code: "ENGIN 351", title: "Writing in Engineering", credits: 3, done: false, note: "offered in summer" },
    ],
  },
  {
    term: "Fall 2027",
    status: "planned",
    courses: [
      { code: "E&C-ENG 361", title: "Electrical Engineering", credits: 3, done: false },
      { code: "M&I-ENG 313", title: "Design of Mechanical Components", credits: 3, done: false },
      { code: "M&I-ENG 395A", title: "Seminar: Engineering Professionalism", credits: 1, done: false },
      { code: "STAT 315", title: "Statistics", credits: 3, done: false },
      { code: "BME TECH ELEC #1", title: "Technical elective (e.g. MIE 685 Biorobotics)", credits: 3, done: false },
      { code: "ME TECH ELEC #1", title: "Technical elective", credits: 3, done: false },
    ],
  },
  {
    term: "Spring 2028",
    status: "planned",
    courses: [
      { code: "BMED-ENG 320", title: "Bioinstrumentation", credits: 3, done: false, note: "needs E&C-ENG 361" },
      { code: "M&I-ENG 354", title: "Heat Transfer", credits: 3, done: false },
      { code: "M&I-ENG 344", title: "System Dynamics", credits: 3, done: false },
      { code: "M&I-ENG 413", title: "Design of Mechanical Assemblies", credits: 3, done: false, note: "after 313" },
      { code: "GEN ED", title: "Diversity (DG) elective", credits: 4, done: false },
    ],
  },
  {
    term: "Summer 2028",
    status: "planned",
    courses: [
      { code: "BME TECH ELEC #2", title: "Technical elective", credits: 3, done: false },
      { code: "ME TECH ELEC #2", title: "Technical elective", credits: 3, done: false },
    ],
  },
  {
    term: "Fall 2028",
    status: "planned",
    courses: [
      { code: "BMED-ENG 330", title: "Quantitative Physiology", credits: 3, done: false },
      { code: "BMED-ENG 414", title: "Senior Design I", credits: 3, done: false },
      { code: "M&I-ENG 375", title: "Manufacturing Processes", credits: 3, done: false },
      { code: "M&I-ENG 402", title: "ME Lab II", credits: 3, done: false },
      { code: "BME TECH ELEC #3", title: "Technical elective", credits: 3, done: false },
      { code: "ME TECH ELEC #3", title: "Technical elective", credits: 3, done: false },
    ],
  },
  {
    term: "Spring 2029",
    status: "planned",
    courses: [
      { code: "BMED-ENG 430", title: "Systems Biology", credits: 3, done: false },
      { code: "BMED-ENG 415", title: "Senior Design II", credits: 3, done: false, note: "Integrative Experience" },
      { code: "M&I-ENG 415", title: "Design of Mechanical Systems", credits: 3, done: false, note: "capstone" },
      { code: "BME TECH ELEC #4", title: "Technical elective", credits: 3, done: false },
      { code: "ME TECH ELEC #4", title: "Technical elective", credits: 3, done: false },
    ],
  },
];
