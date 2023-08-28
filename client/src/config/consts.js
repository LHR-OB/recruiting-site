const consts = {
    USER_ROLES: [
        "Admin",
        "Team Management",
        "System Lead",
        "Interviewer",
        "Applicant",
    ],
    MAJORS: [
        "ASE",
        "ARE",
        "BME",
        "CE",
        "CHE",
        "COE",
        "ECE",
        "EVE",
        "ME",
        "PE",
        "CS",
        "CNS",
        "Business",
        "Other",
    ],
    YEARS: [
        "First",
        "Second",
        "Third",
        "Fourth",
        "Fifth+",
        "Graduate",
    ],
    APPLICATION_QUESTIONS: [
        {
            question: "Why are you interested in joining Longhorn Racing?",
            options: null,
        },
        {
            question: "Why are you applying for these systems?",
            options: null,
        },
        {
            question: "What general interests do you have and what experience would you like to gain by joining LHR?",
            options: null,
        },
        {
            question: "What specific engineering and/or operations experience would you like to gain? Select all that apply.",
            options: [
                "CFD (Computational Fluid Dynamics)",
                "Embedded systems programming",
                "Maching learning and simulation (Reinforcement learning, Race strategy simulations)",
                "PCB design",
                "Hardware/Software design",
                "Power management",
                "CAD (Computer Aided Design)",
                "Testing",
                "Mill/Lathe machining",
                "Composites manufacturing",
                "Welding",
                "Corporate relations",
                "Marketing",
                "Management",
                "Communications",
                "Photography/Videography",
                "Public relations",
                "Other",
            ]
        },
    ],
    INTERVIEW_SCHEDULE_BUFFER: 6, // Hours
}

export default consts;
