PLAN = [
    {
        "term": "Fall 1",
        "courses": [
            {"code": "MATH 131", "title": "Calculus I", "credits": 4, "done": True},
            {"code": "MATH 132", "title": "Calculus II", "credits": 4, "done": True},
            {"code": "MATH 233", "title": "Multivariate Calculus", "credits": 4, "done": True},
            {"code": "CHEM 111", "title": "Chemistry I", "credits": 4, "done": True},
            {"code": "PHYSICS 151", "title": "General Physics I", "credits": 4, "done": True},
            {"code": "ENGIN 114", "title": "Intro to BME", "credits": 3, "done": True},
            {"code": "ENGLWRIT 112", "title": "College Writing", "credits": 3, "done": True},
            {"code": "HISTORY 151", "title": "US History since 1876", "credits": 3, "done": True},
            {"code": "PSYCH 100", "title": "Introductory Psychology", "credits": 4, "done": True},
            {"code": "E&C-ENG 150", "title": "Better Decisions by Humans & AI", "credits": 4, "done": True},
        ],
    },
    {
        "term": "Spring 1",
        "courses": [
            {"code": "CHEM 112", "title": "Chemistry II", "credits": 4, "done": True},
            {"code": "PHYSICS 152", "title": "General Physics II", "credits": 4, "done": True},
            {"code": "M&I-ENG 201", "title": "Intro to Materials Science", "credits": 3, "done": True},
            {"code": "M&I-ENG 210", "title": "Statics", "credits": 3, "done": True},
            {"code": "M&I-ENG 273", "title": "Probability & Statistics for Engineers", "credits": 3, "done": True},
            {
                "code": "HM&FNART 102",
                "title": "Traversing Differences: Global",
                "credits": 4,
                "done": True,
                "note": "resolving INC — 1 assignment left",
            },
        ],
    },
    {
        "term": "Summer 1 (transfer)",
        "courses": [
            {
                "code": "M&I-ENG 211",
                "title": "Strength of Materials",
                "credits": 3,
                "done": False,
                "note": "also satisfies BMED-ENG 241 — send transcript ASAP",
            },
            {"code": "M&I-ENG 230", "title": "Thermodynamics", "credits": 3, "done": False, "note": "send transcript ASAP"},
            {"code": "MATH 331", "title": "Differential Equations", "credits": 3, "done": False, "note": "send transcript ASAP"},
        ],
    },
    {
        "term": "Fall 2",
        "courses": [
            {"code": "BMED-ENG 210", "title": "Intro to Biology for Engineers", "credits": 4, "done": False},
            {"code": "M&I-ENG 124", "title": "Computational Approaches to Engineering", "credits": 3, "done": False},
            {"code": "M&I-ENG 302", "title": "ME Lab I", "credits": 3, "done": False},
            {"code": "M&I-ENG 310", "title": "Dynamics", "credits": 3, "done": False},
            {"code": "M&I-ENG 340", "title": "Fluid Mechanics I", "credits": 3, "done": False},
        ],
    },
    {
        "term": "Spring 2",
        "courses": [
            {"code": "KIN 270", "title": "Anatomy & Physiology I", "credits": 4, "done": False},
            {"code": "GEN ED", "title": "Arts & Literature elective", "credits": 4, "done": False},
            {"code": "BMED-ENG 275", "title": "Biomechanics", "credits": 3, "done": False, "req": "211/241 transfer posted"},
            {"code": "BMED-ENG 300", "title": "Biomaterials", "credits": 3, "done": False},
            {"code": "BMED-ENG 310", "title": "Intro Lab Techniques", "credits": 3, "done": False},
        ],
    },
    {
        "term": "Summer 2",
        "courses": [
            {"code": "ENGIN 351", "title": "Writing in Engineering", "credits": 3, "done": False, "note": "offered in summer"},
        ],
    },
    {
        "term": "Fall 3",
        "courses": [
            {"code": "E&C-ENG 361", "title": "Electrical Engineering", "credits": 3, "done": False},
            {"code": "M&I-ENG 313", "title": "Design of Mechanical Components", "credits": 3, "done": False},
            {"code": "M&I-ENG 395A", "title": "Seminar: Engineering Professionalism", "credits": 1, "done": False},
            {"code": "STAT 315", "title": "Statistics", "credits": 3, "done": False},
            {"code": "BME TECH ELEC #1", "title": "Technical elective (e.g. MIE 685 Biorobotics)", "credits": 3, "done": False},
            {"code": "ME TECH ELEC #1", "title": "Technical elective", "credits": 3, "done": False},
        ],
    },
    {
        "term": "Spring 3",
        "courses": [
            {"code": "BMED-ENG 320", "title": "Bioinstrumentation", "credits": 3, "done": False, "req": "E&C-ENG 361"},
            {"code": "M&I-ENG 354", "title": "Heat Transfer", "credits": 3, "done": False},
            {"code": "M&I-ENG 344", "title": "System Dynamics", "credits": 3, "done": False},
            {"code": "M&I-ENG 413", "title": "Design of Mechanical Assemblies", "credits": 3, "done": False, "req": "313"},
            {"code": "GEN ED", "title": "Diversity (DG) elective", "credits": 4, "done": False},
        ],
    },
    {
        "term": "Summer 3",
        "courses": [
            {"code": "BME TECH ELEC #2", "title": "Technical elective", "credits": 3, "done": False},
            {"code": "ME TECH ELEC #2", "title": "Technical elective", "credits": 3, "done": False},
        ],
    },
    {
        "term": "Fall 4",
        "courses": [
            {"code": "BMED-ENG 330", "title": "Quantitative Physiology", "credits": 3, "done": False},
            {"code": "BMED-ENG 414", "title": "Senior Design I", "credits": 3, "done": False},
            {"code": "M&I-ENG 375", "title": "Manufacturing Processes", "credits": 3, "done": False},
            {"code": "M&I-ENG 402", "title": "ME Lab II", "credits": 3, "done": False},
            {"code": "BME TECH ELEC #3", "title": "Technical elective", "credits": 3, "done": False},
            {"code": "ME TECH ELEC #3", "title": "Technical elective", "credits": 3, "done": False},
        ],
    },
    {
        "term": "Spring 4",
        "courses": [
            {"code": "BMED-ENG 430", "title": "Systems Biology", "credits": 3, "done": False},
            {"code": "BMED-ENG 415", "title": "Senior Design II", "credits": 3, "done": False, "note": "Integrative Experience"},
            {"code": "M&I-ENG 415", "title": "Design of Mechanical Systems", "credits": 3, "done": False, "note": "capstone"},
            {"code": "BME TECH ELEC #4", "title": "Technical elective", "credits": 3, "done": False},
            {"code": "ME TECH ELEC #4", "title": "Technical elective", "credits": 3, "done": False},
        ],
    },
]
