/* MOBILE NAVIGATION */

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
  });
});

document.addEventListener("click", (event) => {
  if (!navLinks.contains(event.target) && event.target !== menuBtn) {
    navLinks.classList.remove("open");
  }
});

/* ACADEMIC PROJECT CAROUSEL */

const academicCarousel = document.getElementById("academicCarousel");

const academicCards = [
  ...academicCarousel.querySelectorAll(".mini-project")
];

let academicIndex = 0;

function showAcademicProject(index) {
  academicIndex =
    (index + academicCards.length) % academicCards.length;

  academicCards[academicIndex].scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "start"
  });
}

document
  .getElementById("academicPrev")
  .addEventListener("click", () => {
    showAcademicProject(academicIndex - 1);
  });

document
  .getElementById("academicNext")
  .addEventListener("click", () => {
    showAcademicProject(academicIndex + 1);
  });

let academicRotation = setInterval(() => {
  showAcademicProject(academicIndex + 1);
}, 5500);

academicCarousel.addEventListener("mouseenter", () => {
  clearInterval(academicRotation);
});

academicCarousel.addEventListener("focusin", () => {
  clearInterval(academicRotation);
});

/* ACADEMIC PDF VIEWER */

const documentModal = document.getElementById("documentModal");
const documentView = document.getElementById("documentView");
const documentTitle = document.getElementById("documentTitle");
const documentOpen = document.getElementById("documentOpen");
const documentClose = document.getElementById("documentClose");

function openDocument(title, url) {
  documentTitle.textContent = title;
  documentView.src = `${url}#view=FitH`;
  documentOpen.href = url;

  documentModal.classList.add("open");
  document.body.style.overflow = "hidden";
  documentClose.focus();
}

function closeDocument() {
  documentModal.classList.remove("open");
  documentView.src = "";
  document.body.style.overflow = "";
}

academicCards.forEach((card) => {
  card.addEventListener("click", () => {
    openDocument(card.dataset.title, card.dataset.document);
  });
});

documentClose.addEventListener("click", closeDocument);

documentModal.addEventListener("click", (event) => {
  if (event.target === documentModal) {
    closeDocument();
  }
});

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    documentModal.classList.contains("open")
  ) {
    closeDocument();
  }
});

/* DASHBOARD CAROUSEL */

const dashboardGallery =
  document.getElementById("dashboardGallery");

const dashboardCards = [
  ...document.querySelectorAll(".dashboard-card")
];

const dashboardPagination =
  document.getElementById("dashboardPagination");

let dashboardIndex = 0;

function showDashboard(index, behavior = "smooth") {
  dashboardIndex =
    (index + dashboardCards.length) % dashboardCards.length;

  dashboardCards.forEach((card, cardIndex) => {
    card.classList.toggle(
      "is-active",
      cardIndex === dashboardIndex
    );
  });

  document
    .querySelectorAll(".dashboard-dot")
    .forEach((dot, dotIndex) => {
      dot.classList.toggle(
        "active",
        dotIndex === dashboardIndex
      );
    });

  dashboardGallery.scrollTo({
    left: dashboardCards[dashboardIndex].offsetLeft,
    behavior
  });
}

/* CREATE DASHBOARD NAVIGATION DOTS */

dashboardCards.forEach((card, index) => {
  const dot = document.createElement("button");

  dot.type = "button";
  dot.className =
    "dashboard-dot" + (index === 0 ? " active" : "");

  dot.setAttribute(
    "aria-label",
    `Show dashboard ${index + 1}`
  );

  dot.addEventListener("click", () => {
    showDashboard(index);
  });

  dashboardPagination.appendChild(dot);
});

/* DASHBOARD ARROWS */

document
  .getElementById("dashboardPrev")
  .addEventListener("click", () => {
    showDashboard(dashboardIndex - 1);
  });

document
  .getElementById("dashboardNext")
  .addEventListener("click", () => {
    showDashboard(dashboardIndex + 1);
  });

/* AUTOMATIC DASHBOARD ROTATION */

let dashboardRotation = setInterval(() => {
  showDashboard(dashboardIndex + 1);
}, 5200);

function pauseDashboardRotation() {
  clearInterval(dashboardRotation);
}

function resumeDashboardRotation() {
  clearInterval(dashboardRotation);

  dashboardRotation = setInterval(() => {
    showDashboard(dashboardIndex + 1);
  }, 5200);
}

dashboardGallery.addEventListener(
  "mouseenter",
  pauseDashboardRotation
);

dashboardGallery.addEventListener(
  "mouseleave",
  resumeDashboardRotation
);

dashboardGallery.addEventListener(
  "focusin",
  pauseDashboardRotation
);

dashboardGallery.addEventListener(
  "focusout",
  resumeDashboardRotation
);

/* DASHBOARD IMAGE VIEWER */

const imageModal = document.getElementById("imageModal");
const imageView = document.getElementById("imageView");
const imageTitle = document.getElementById("imageTitle");
const imageStage = document.getElementById("imageStage");
const imageClose = document.getElementById("imageClose");

function openDashboardImage(card) {
  imageTitle.textContent = card.dataset.title;
  imageView.src = card.dataset.image;

  const dashboardImage = card.querySelector(
    ".dashboard-image-canvas img"
  );

  if (dashboardImage) {
    imageView.alt = dashboardImage.alt;
  }

  imageStage.classList.toggle(
    "crop-caption",
    card.dataset.crop === "caption"
  );

  imageStage.classList.toggle(
    "hiv-dashboard",
    card.dataset.crop === "false"
  );

  imageModal.classList.add("open");
  document.body.style.overflow = "hidden";
  imageClose.focus();
}

function closeDashboardImage() {
  imageModal.classList.remove("open");
  imageView.src = "";

  imageStage.classList.remove(
    "crop-caption",
    "hiv-dashboard"
  );

  document.body.style.overflow = "";
}

dashboardCards.forEach((card) => {
  card.addEventListener("click", () => {
    openDashboardImage(card);
  });
});

imageClose.addEventListener(
  "click",
  closeDashboardImage
);

imageModal.addEventListener("click", (event) => {
  if (event.target === imageModal) {
    closeDashboardImage();
  }
});

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    imageModal.classList.contains("open")
  ) {
    closeDashboardImage();
  }
});

/* SELECTED COMPLETED PROJECTS */

const selectedProjects = [
  {
    index: "01",
    title: "HIV Community Needs Assessment",
    organization:
      "Gwinnett County · GNR Public Health District",
    description:
      "A community-focused assessment combining public surveillance data, local context, and a review of prevention and linkage resources to identify gaps and priorities for action.",
    tags: [
      "AIDSVu",
      "Georgia DPH",
      "Needs assessment",
      "Health equity"
    ],
    color: "#DBEAFE",
    shape: "border-radius:52px",
    status: "Completed",
    id: "ape1"
  },
  {
    index: "02",
    title: "Program Evaluation Plan",
    organization: "H.Y.P.E. to Empower",
    description:
      "A CDC-informed evaluation plan for community-based HIV prevention and linkage services, including a logic model, evaluation questions, indicators, and culturally responsive data-collection tools.",
    tags: [
      "CDC Evaluation Framework",
      "Logic model",
      "Program evaluation"
    ],
    color: "#EDE9FE",
    shape:
      "border-radius:260px 260px 18px 18px",
    status: "Completed",
    id: "ape2"
  },
  {
    index: "03",
    title: "Impact Story Process Improvement",
    organization: "American Cancer Society",
    description:
      "A process-improvement case study showing how I standardized impact-story intake, strengthened data quality, and organized qualitative program evidence for analysis and communication.",
    tags: [
      "Implementation science",
      "Data quality",
      "Knowledge translation"
    ],
    color: "#D1FAE5",
    shape:
      "border-radius:44% 56% 42% 58% / 56% 39% 61% 44%",
    status: "Completed",
    id: "acs1"
  },
  {
    index: "04",
    title:
      "Community Outreach Implementation Toolkit",
    organization: "H.Y.P.E. to Empower",
    description:
      "A reusable toolkit for community-host outreach, covering partner onboarding, event preparation, communication, documentation, and follow-up workflows.",
    tags: [
      "Implementation toolkit",
      "Partner engagement",
      "Process design"
    ],
    color: "#FEF3C7",
    shape:
      "border-radius:52px 190px 52px 52px",
    status: "Completed",
    id: "hype1"
  }
];

const projectGrid = document.getElementById("projGrid");

selectedProjects.forEach((project) => {
  const article = document.createElement("article");

  article.className = "proj-feature";

  const tagsHTML = project.tags
    .map((tag) => {
      return `<span class="proj-tag">${tag}</span>`;
    })
    .join("");

  const visualHTML = project.image
    ? `
      <img
        class="proj-cover-image${
          project.fit === "contain"
            ? " cover-contain"
            : ""
        }"
        src="${project.image}"
        alt="${project.alt}"
      >
    `
    : `
      <span style="font-size:2rem;opacity:.3">□</span>
      <b>Portfolio sample / deliverable preview</b>
      <small>Open the project summary</small>
    `;

  article.innerHTML = `
    <button
      class="proj-visual${
        project.image ? " has-image" : ""
      }"
      style="background:${project.color};${project.shape}"
      onclick="openPanel('${project.id}')"
      aria-label="Open ${project.title} project details"
    >
      <span class="proj-idx">${project.index}</span>

      <span class="proj-status status-complete">
        ${project.status}
      </span>

      ${visualHTML}
    </button>

    <div class="proj-copy">
      <p class="kicker">Completed project</p>

      <h3>${project.title}</h3>

      <p class="org">${project.organization}</p>

      <p>${project.description}</p>

      <div class="proj-tags">
        ${tagsHTML}
      </div>

      <button
        class="textlink"
        onclick="openPanel('${project.id}')"
      >
        Open project detail ↗
      </button>
    </div>
  `;

  projectGrid.appendChild(article);
});

/* PROJECT LAB */

const projectLabData = {
  "HIV & STI": [
    {
      name: "HIV Care Cascade — Georgia",
      type: "Data story",
      status: "active",
      id: "ape4"
    },
    {
      name: "HIV Linkage-to-Care Policy Brief",
      type: "Policy brief",
      status: "active",
      id: "ape3"
    },
    {
      name:
        "Culturally Responsive Survey Tool",
      type: "Survey tool",
      status: "active",
      id: "hiv1"
    }
  ],

  "Maternal health": [
    {
      name:
        "Georgia Maternal Mortality Dashboard",
      type: "Dashboard",
      status: "concept",
      id: "mat1"
    },
    {
      name: "Policy Brief — Closing the Gap",
      type: "Policy brief",
      status: "concept",
      id: "mat2"
    },
    {
      name: "Community Infographic Series",
      type: "Infographic",
      status: "concept",
      id: "mat3"
    }
  ],

  Overdose: [
    {
      name:
        "County-Level Overdose Mortality Analysis",
      type: "Analysis",
      status: "concept",
      id: "opi1"
    },
    {
      name:
        "Harm Reduction Resource Gap — Atlanta Metro",
      type: "Gap analysis",
      status: "concept",
      id: "opi2"
    },
    {
      name:
        "Racial Disparities Literature Review",
      type: "Literature review",
      status: "concept",
      id: "opi3"
    }
  ],

  "Cancer equity": [
    {
      name:
        "Breast Cancer Screening Dashboard",
      type: "Dashboard",
      status: "concept",
      id: "bc1"
    },
    {
      name: "Data Story — Diagnosed Too Late",
      type: "Data story",
      status: "concept",
      id: "bc2"
    },
    {
      name: "Community Screening Guide",
      type: "Community tool",
      status: "concept",
      id: "bc3"
    }
  ],

  "Infant mortality": [
    {
      name:
        "Infant Mortality Dashboard — Georgia",
      type: "Dashboard",
      status: "concept",
      id: "inf1"
    },
    {
      name:
        "Data Story — Born Into Disparity",
      type: "Data story",
      status: "concept",
      id: "inf2"
    },
    {
      name: "Infographic — The First 28 Days",
      type: "Infographic",
      status: "concept",
      id: "inf3"
    }
  ]
};

const tabButtons =
  document.getElementById("tabButtons");

const tabPanels =
  document.getElementById("tabPanels");

Object.entries(projectLabData).forEach(
  ([category, projects], categoryIndex) => {
    const button = document.createElement("button");

    button.className =
      "tab-btn" +
      (categoryIndex === 0 ? " active" : "");

    button.textContent = category;
    button.dataset.tab = categoryIndex;

    tabButtons.appendChild(button);

    const panel = document.createElement("div");

    panel.className =
      "tab-panel" +
      (categoryIndex === 0 ? " active" : "");

    panel.dataset.panel = categoryIndex;

    panel.innerHTML = projects
      .map((project, projectIndex) => {
        const statusClass =
          project.status === "active"
            ? "ls-active"
            : "ls-concept";

        const statusText =
          project.status === "active"
            ? "Active"
            : "Planned concept";

        return `
          <div
            class="lab-item"
            onclick="openPanel('${project.id}')"
          >
            <span class="lab-num">
              0${projectIndex + 1}
            </span>

            <div>
              <div class="lab-item-label">
                ${project.type}
              </div>

              <h3>${project.name}</h3>
            </div>

            <div
              style="display:flex;align-items:center;gap:.6rem"
            >
              <span
                class="lab-item-status ${statusClass}"
              >
                ${statusText}
              </span>

              <span class="lab-arrow">↗</span>
            </div>
          </div>
        `;
      })
      .join("");

    tabPanels.appendChild(panel);
  }
);

tabButtons.addEventListener("click", (event) => {
  const button = event.target.closest(".tab-btn");

  if (!button) {
    return;
  }

  document.querySelectorAll(".tab-btn").forEach(
    (tabButton) => {
      tabButton.classList.toggle(
        "active",
        tabButton === button
      );
    }
  );

  document.querySelectorAll(".tab-panel").forEach(
    (panel) => {
      panel.classList.toggle(
        "active",
        panel.dataset.panel === button.dataset.tab
      );
    }
  );
});

/* EXPERIENCE ROADMAP */

function toggleRoadmap(element, column) {
  const isOpen = element.classList.contains("open");

  const roadmap =
    column === "pro"
      ? document.getElementById("roadmap-pro")
      : document.getElementById("roadmap-vol");

  roadmap
    .querySelectorAll(".roadmap-item")
    .forEach((item) => {
      item.classList.remove("open");
    });

  if (!isOpen) {
    element.classList.add("open");
  }
}

/* PROJECT DETAILS */

const projectDetails = {
  ape1: {
    badge: "HIV · Community assessment",
    badgeColor: "#DBEAFE",
    badgeText: "#1D4ED8",
    title:
      "HIV Community Needs Assessment — Gwinnett County",
    status: "Completed",
    statusClass: "pbadge-active",
    timeline: "May – July 2026",

    overview:
      "A community-focused assessment developed through my applied practice work with H.Y.P.E. to Empower and collaboration within the GNR Public Health network. It examines the local HIV context, prevention landscape, community needs, and opportunities to strengthen access and linkage.",

    methods:
      "Synthesized public county-level surveillance information from AIDSVu and Georgia DPH with demographic context, published research, resource mapping, and observations from community outreach. The portfolio version excludes confidential program testing figures and priority-population counts.",

    sources: [
      "AIDSVu",
      "Georgia DPH HIV Surveillance",
      "U.S. Census Bureau",
      "Peer-reviewed literature"
    ],

    skills: [
      "Community needs assessment",
      "HIV surveillance interpretation",
      "Resource mapping",
      "Health equity analysis",
      "Technical writing"
    ],

    findings:
      "The assessment identified opportunities to strengthen culturally responsive outreach, stigma reduction, prevention education, referral coordination, and follow-up processes across community settings."
  },

  ape2: {
    badge: "HIV · Evaluation plan",
    badgeColor: "#EDE9FE",
    badgeText: "#5B21B6",
    title:
      "Program Evaluation Plan — Community-Based HIV Prevention and Linkage Services",
    status: "Completed",
    statusClass: "pbadge-active",
    timeline: "May – July 2026",

    overview:
      "A CDC-informed evaluation plan created for a community-based HIV prevention and linkage program. The portfolio version demonstrates the complete evaluation design while protecting confidential program performance information.",

    methods:
      "Applied the CDC evaluation framework to define program context, stakeholders, a logic model, evaluation questions, process and outcome indicators, data sources, and culturally responsive data-collection procedures.",

    sources: [
      "CDC Program Evaluation Framework",
      "Program documents",
      "Peer-reviewed HIV prevention literature"
    ],

    skills: [
      "Program evaluation design",
      "Logic model development",
      "Indicator selection",
      "Culturally responsive evaluation",
      "Technical reporting"
    ],

    findings:
      "Produced a practical measurement structure that connects program activities to intended outcomes, clarifies documentation needs, and supports continuous program improvement without disclosing internal testing or participant metrics."
  },

  acs1: {
    badge:
      "Cancer control · Process improvement",
    badgeColor: "#D1FAE5",
    badgeText: "#065F46",
    title:
      "Impact Story Process Improvement — American Cancer Society",
    status: "Completed",
    statusClass: "pbadge-active",
    timeline: "June – July 2026",

    overview:
      "A process-improvement case study based on my American Cancer Society implementation-science internship. The work strengthened how patient- and health-system impact stories were collected, categorized, quality checked, retrieved, and prepared for knowledge translation.",

    methods:
      "Reviewed more than 800 records spanning three years, developed standardized metadata and topic tags, refined Microsoft Forms intake fields, documented quality-assurance rules, and translated the workflow into a searchable internal Story Explorer concept.",

    sources: [
      "American Cancer Society program records",
      "Microsoft Forms",
      "Excel",
      "Power BI"
    ],

    skills: [
      "Implementation science",
      "Data quality assurance",
      "Process improvement",
      "Metadata design",
      "Knowledge translation"
    ],

    findings:
      "Created a more consistent and searchable impact-story workflow that improved record organization, supported analysis, and made program evidence easier for internal teams to retrieve and communicate. No confidential records or internal screenshots are displayed."
  },

  hype1: {
    badge:
      "Community health · Implementation toolkit",
    badgeColor: "#FEF3C7",
    badgeText: "#92400E",
    title:
      "Community Outreach Implementation Toolkit — H.Y.P.E. to Empower",
    status: "Completed",
    statusClass: "pbadge-active",
    timeline: "May – July 2026",

    overview:
      "A reusable implementation toolkit created to support community-host partnerships and consistent delivery of outreach activities. It translates program operations into clear, repeatable steps that partners and staff can follow.",

    methods:
      "Organized the workflow into partner outreach, onboarding, event planning, materials preparation, roles and responsibilities, documentation, follow-up, and continuous-improvement sections. Included practical checklists, communication templates, and tracking tools.",

    sources: [
      "Program workflow review",
      "Partner feedback",
      "Community outreach observations",
      "Implementation planning resources"
    ],

    skills: [
      "Toolkit development",
      "Partner engagement",
      "Workflow design",
      "Training support",
      "Project coordination"
    ],

    findings:
      "Delivered a structured set of tools that supports clearer expectations, more consistent preparation and documentation, and easier onboarding for future community-host partners."
  },

  ape3: {
    badge: "HIV · Policy brief",
    badgeColor: "#DBEAFE",
    badgeText: "#1D4ED8",
    title: "HIV Linkage-to-Care Policy Brief",
    status: "Active",
    statusClass: "pbadge-active",
    timeline: "April – August 2026",

    overview:
      "A policy brief examining structural barriers to HIV linkage to care among Black youth in the South, framed around Georgia.",

    methods:
      "Structured literature review using PubMed and Google Scholar, synthesized into a narrative brief with a plain-language summary and policy recommendations.",

    sources: [
      "PubMed",
      "Google Scholar",
      "CDC HIV Surveillance Reports",
      "Georgia DPH",
      "HRSA Ryan White data"
    ],

    skills: [
      "Scientific writing",
      "Literature synthesis",
      "Policy brief development",
      "Health equity analysis",
      "HIV prevention knowledge"
    ],

    findings:
      "Completed policy brief will be added upon finalization."
  },

  ape4: {
    badge: "HIV · Data story",
    badgeColor: "#DBEAFE",
    badgeText: "#1D4ED8",
    title: "HIV Care Cascade — Georgia",
    status: "Active",
    statusClass: "pbadge-active",
    timeline: "April – August 2026",

    overview:
      "A narrative data story examining Georgia's HIV care cascade by geography and population characteristics.",

    methods:
      "Uses public information from AIDSVu and CDC AtlasPlus with narrative interpretation and Power BI visuals.",

    sources: [
      "AIDSVu",
      "CDC AtlasPlus",
      "Georgia DPH HIV Surveillance",
      "Power BI"
    ],

    skills: [
      "Data storytelling",
      "Health communication",
      "Power BI",
      "HIV surveillance"
    ],

    findings:
      "Published article and visuals will be linked upon completion."
  },

  hiv1: {
    badge: "HIV · Survey tool",
    badgeColor: "#EDE9FE",
    badgeText: "#5B21B6",
    title:
      "Culturally Responsive Survey Tool — HIV Stigma",
    status: "Active",
    statusClass: "pbadge-active",
    timeline: "April – August 2026",

    overview:
      "A survey instrument assessing HIV-related stigma and barriers to care among young Black adults in urban settings.",

    methods:
      "Developed using validated stigma scales adapted for a youth audience with community-informed language, health-literacy principles, and trauma-informed design.",

    sources: [
      "HIV Stigma Scale",
      "Survey-design literature",
      "CDC cultural-competency guidance",
      "Health-literacy frameworks"
    ],

    skills: [
      "Survey-instrument design",
      "Cultural responsiveness",
      "Health literacy",
      "Qualitative methods",
      "Trauma-informed design"
    ],

    findings:
      "Final survey instrument and methodology note will be added upon completion."
  }
};

/* ADD PLANNED PROJECT DETAILS */

const plannedProjects = {
  mat1: {
    badge: "Maternal health · Dashboard",
    badgeColor: "#FCE7F3",
    badgeText: "#9D174D",
    title:
      "Georgia Maternal Mortality Dashboard",
    overview:
      "A planned Power BI dashboard visualizing maternal mortality patterns across Georgia.",
    methods:
      "Proposed use of CDC WONDER, Georgia DPH reports, and social-vulnerability data.",
    sources: [
      "CDC WONDER",
      "Georgia DPH",
      "ATSDR Social Vulnerability Index"
    ],
    skills: [
      "Power BI",
      "Reproductive health equity",
      "Data visualization",
      "Spatial analysis"
    ]
  },

  mat2: {
    badge: "Maternal health · Policy brief",
    badgeColor: "#FCE7F3",
    badgeText: "#9D174D",
    title: "Policy Brief — Closing the Gap",
    overview:
      "A planned policy brief examining structural drivers of Black maternal mortality in Georgia.",
    methods:
      "Proposed synthesis of peer-reviewed evidence, Georgia policy information, and maternal-health reports.",
    sources: [
      "PubMed",
      "Georgia DPH",
      "March of Dimes"
    ],
    skills: [
      "Policy writing",
      "Evidence synthesis",
      "Maternal-health policy"
    ]
  },

  mat3: {
    badge: "Maternal health · Infographic",
    badgeColor: "#FCE7F3",
    badgeText: "#9D174D",
    title:
      "Community Infographic Series — Maternal Mortality",
    overview:
      "A planned infographic series translating maternal-health information into accessible community education.",
    methods:
      "Proposed use of public data, plain-language writing, Canva, and health-literacy principles.",
    sources: [
      "CDC WONDER",
      "Georgia DPH",
      "Canva"
    ],
    skills: [
      "Health communication",
      "Canva",
      "Health literacy"
    ]
  },

  opi1: {
    badge: "Overdose · Analysis",
    badgeColor: "#FEF3C7",
    badgeText: "#92400E",
    title:
      "County-Level Overdose Mortality Analysis — Georgia",
    overview:
      "A planned county-level analysis of overdose mortality patterns in Georgia.",
    methods:
      "Proposed use of public mortality data and Power BI trend visualizations.",
    sources: [
      "CDC WONDER",
      "Georgia DPH",
      "Power BI"
    ],
    skills: [
      "Surveillance analysis",
      "Power BI",
      "Overdose epidemiology"
    ]
  },

  opi2: {
    badge: "Overdose · Gap analysis",
    badgeColor: "#FEF3C7",
    badgeText: "#92400E",
    title:
      "Harm Reduction Resource Gap — Atlanta Metro",
    overview:
      "A planned spatial analysis comparing harm-reduction services with overdose burden.",
    methods:
      "Proposed mapping of service locations and public overdose data.",
    sources: [
      "SAMHSA",
      "CDC WONDER",
      "QGIS"
    ],
    skills: [
      "GIS",
      "Gap analysis",
      "Harm reduction"
    ]
  },

  opi3: {
    badge: "Overdose · Literature review",
    badgeColor: "#FEF3C7",
    badgeText: "#92400E",
    title:
      "Racial Disparities in Overdose Mortality",
    overview:
      "A planned structured literature review examining racial disparities in overdose mortality.",
    methods:
      "Proposed systematic search and thematic evidence synthesis.",
    sources: [
      "PubMed",
      "CDC",
      "MMWR"
    ],
    skills: [
      "Literature review",
      "Scientific writing",
      "Evidence synthesis"
    ]
  },

  bc1: {
    badge: "Cancer equity · Dashboard",
    badgeColor: "#FEE2E2",
    badgeText: "#991B1B",
    title:
      "Breast Cancer Screening Dashboard — Georgia",
    overview:
      "A planned dashboard examining breast-cancer screening patterns and disparities.",
    methods:
      "Proposed use of CDC PLACES and public cancer data.",
    sources: [
      "CDC PLACES",
      "Georgia DPH",
      "Power BI"
    ],
    skills: [
      "Cancer epidemiology",
      "Power BI",
      "Health equity"
    ]
  },

  bc2: {
    badge: "Cancer equity · Data story",
    badgeColor: "#FEE2E2",
    badgeText: "#991B1B",
    title: "Data Story — Diagnosed Too Late",
    overview:
      "A planned narrative examining disparities in late-stage breast-cancer diagnosis.",
    methods:
      "Proposed combination of public data, evidence, and narrative communication.",
    sources: [
      "CDC PLACES",
      "Georgia DPH",
      "Peer-reviewed literature"
    ],
    skills: [
      "Data storytelling",
      "Cancer equity",
      "Long-form writing"
    ]
  },

  bc3: {
    badge: "Cancer equity · Community tool",
    badgeColor: "#FEE2E2",
    badgeText: "#991B1B",
    title:
      "Community Breast Cancer Screening Guide",
    overview:
      "A planned plain-language screening guide for Black women in Georgia.",
    methods:
      "Proposed use of current screening guidance, public resources, and health-literacy principles.",
    sources: [
      "American Cancer Society",
      "CDC",
      "Georgia DPH"
    ],
    skills: [
      "Health literacy",
      "Canva",
      "Community education"
    ]
  },

  inf1: {
    badge: "Infant mortality · Dashboard",
    badgeColor: "#CFFAFE",
    badgeText: "#164E63",
    title:
      "Infant Mortality Dashboard — Georgia",
    overview:
      "A planned Power BI dashboard examining infant-mortality patterns across Georgia.",
    methods:
      "Proposed use of CDC WONDER and social-vulnerability information.",
    sources: [
      "CDC WONDER",
      "Georgia DPH",
      "ATSDR"
    ],
    skills: [
      "Infant-mortality epidemiology",
      "Power BI",
      "Spatial analysis"
    ]
  },

  inf2: {
    badge: "Infant mortality · Data story",
    badgeColor: "#CFFAFE",
    badgeText: "#164E63",
    title: "Data Story — Born Into Disparity",
    overview:
      "A planned narrative examining racial disparities in infant mortality.",
    methods:
      "Proposed synthesis of surveillance data, structural context, and evidence-based interventions.",
    sources: [
      "CDC WONDER",
      "Georgia DPH",
      "March of Dimes"
    ],
    skills: [
      "Data storytelling",
      "Health equity",
      "Long-form writing"
    ]
  },

  inf3: {
    badge: "Infant mortality · Infographic",
    badgeColor: "#CFFAFE",
    badgeText: "#164E63",
    title: "Infographic — The First 28 Days",
    overview:
      "A planned infographic translating neonatal-mortality information into accessible community education.",
    methods:
      "Proposed use of public surveillance information, Canva, and health-literacy principles.",
    sources: [
      "CDC WONDER",
      "Georgia DPH",
      "Canva"
    ],
    skills: [
      "Health communication",
      "Canva",
      "Neonatal epidemiology"
    ]
  }
};

Object.entries(plannedProjects).forEach(
  ([id, project]) => {
    projectDetails[id] = {
      ...project,
      status: "Planned concept",
      statusClass: "pbadge-concept",
      timeline: "Future development",
      findings:
        "This project is clearly labeled as a planned portfolio concept and has not yet been completed."
    };
  }
);

/* OPEN PROJECT PANEL */

function openPanel(id) {
  const project = projectDetails[id];

  if (!project) {
    return;
  }

  const sourceHTML = project.sources
    .map((source) => {
      return `<span class="chip">${source}</span>`;
    })
    .join("");

  const skillsHTML = project.skills
    .map((skill) => {
      return `<span class="skill-chip">${skill}</span>`;
    })
    .join("");

  document.getElementById("panelContent").innerHTML = `
    <span
      class="panel-badge"
      style="
        background:${project.badgeColor};
        color:${project.badgeText};
      "
    >
      ${project.badge}
    </span>

    <div class="panel-title">
      ${project.title}
    </div>

    <div class="panel-status-row">
      <span class="pbadge ${project.statusClass}">
        ${project.status}
      </span>

      <span class="pbadge pbadge-time">
        ${project.timeline}
      </span>
    </div>

    <div class="panel-sec">
      <div class="panel-sec-label">
        Overview
      </div>

      <div class="panel-body">
        ${project.overview}
      </div>
    </div>

    <div class="panel-sec">
      <div class="panel-sec-label">
        Methods
      </div>

      <div class="panel-body">
        ${project.methods}
      </div>
    </div>

    <div class="panel-sec">
      <div class="panel-sec-label">
        Data sources
      </div>

      <div class="chips">
        ${sourceHTML}
      </div>
    </div>

    <div class="panel-sec">
      <div class="panel-sec-label">
        Key findings and results
      </div>

      <div class="findings-box">
        ${project.findings}
      </div>
    </div>

    <div class="panel-sec">
      <div class="panel-sec-label">
        Skills demonstrated
      </div>

      <div class="chips">
        ${skillsHTML}
      </div>
    </div>
  `;

  document
    .getElementById("overlay")
    .classList.add("open");

  document
    .getElementById("sidePanel")
    .classList.add("open");

  document.body.style.overflow = "hidden";
}

/* CLOSE PROJECT PANEL */

function closePanel() {
  document
    .getElementById("overlay")
    .classList.remove("open");

  document
    .getElementById("sidePanel")
    .classList.remove("open");

  document.body.style.overflow = "";
}

/* CLOSE PANEL WITH ESCAPE KEY */

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    document
      .getElementById("sidePanel")
      .classList.contains("open")
  ) {
    closePanel();
  }
});
