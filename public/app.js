"use strict";

const STORAGE_KEY = "hydraulix-progress-v1";

const PARTS = {
  pump_p40: {
    id: "pump_p40",
    type: "pump",
    fits: ["pump"],
    name: "Standardpumpe P-40",
    short: "Pumpe P-40",
    spec: "bis 90 bar",
    icon: "pump",
    color: "#ffc84b",
    pressure: 90,
    description: "Eine zuverlässige Werkstattpumpe für leichte bis mittlere Aufgaben. Nicht besonders wild, aber meistens pünktlich."
  },
  pump_p80: {
    id: "pump_p80",
    type: "pump",
    fits: ["pump"],
    name: "Kraftpumpe P-80",
    short: "Pumpe P-80",
    spec: "bis 145 bar",
    icon: "pump",
    color: "#ff7043",
    pressure: 145,
    description: "Mehr Förderkraft für schwere Maschinen. Macht Druck, ohne gleich die Werkstatt umzudekorieren."
  },
  pump_turbo: {
    id: "pump_turbo",
    type: "pump",
    fits: ["pump"],
    name: "Turbopumpe PX-200",
    short: "Turbo PX-200",
    spec: "bis 200 bar",
    icon: "pump",
    color: "#e95353",
    pressure: 200,
    description: "Eine viel zu kräftige Pumpe für die meisten Aufträge. Das Datenblatt enthält verdächtig viele Ausrufezeichen."
  },
  hose_pressure: {
    id: "hose_pressure",
    type: "hose",
    fits: ["supply", "return"],
    name: "Verstärkter Druckschlauch",
    short: "Druckschlauch",
    spec: "Druckseite · 160 bar",
    icon: "hose",
    color: "#ff7043",
    rating: 160,
    description: "Mehrlagig und druckfest. Gedacht für den Weg von der Pumpe zum Steuerblock."
  },
  hose_return: {
    id: "hose_return",
    type: "hose",
    fits: ["supply", "return"],
    name: "Flexibler Rücklaufschlauch",
    short: "Rücklaufschlauch",
    spec: "Rücklauf · 30 bar",
    icon: "hose",
    color: "#35c7e8",
    rating: 30,
    description: "Weich, flexibel und für den entspannten Rückweg zum Tank gebaut – nicht für hohen Pumpendruck."
  },
  valve_43: {
    id: "valve_43",
    type: "valve",
    fits: ["control"],
    name: "Wegeventil 4/3",
    short: "4/3-Wegeventil",
    spec: "Heben · Halt · Senken",
    icon: "valve",
    color: "#52c988",
    directions: 2,
    description: "Lenkt das Öl zum Aus- und Einfahren und kann den Zylinder dazwischen halten. Der Allrounder der Werkstatt."
  },
  valve_32: {
    id: "valve_32",
    type: "valve",
    fits: ["control"],
    name: "Wegeventil 3/2",
    short: "3/2-Wegeventil",
    spec: "nur eine Arbeitsrichtung",
    icon: "valve",
    color: "#8d76df",
    directions: 1,
    description: "Praktisch für einfache Einweg-Funktionen. Bei einem doppelt wirkenden Zylinder fehlt ihm aber eine Richtung."
  },
  valve_check: {
    id: "valve_check",
    type: "valve",
    fits: ["control"],
    name: "Rückschlagventil",
    short: "Rückschlagventil",
    spec: "Durchfluss nur in eine Richtung",
    icon: "check",
    color: "#ffc84b",
    directions: 0,
    description: "Verhindert Rückfluss. Nützlich als Helfer im Kreislauf, aber kein Ersatz für eine komplette Zylindersteuerung."
  },
  filter_clean: {
    id: "filter_clean",
    type: "filter",
    fits: ["filter"],
    name: "Frischer Ölfilter",
    short: "Ölfilter sauber",
    spec: "freier Durchfluss",
    icon: "filter",
    color: "#52c988",
    flow: 100,
    description: "Hält Schmutz aus dem Kreislauf, ohne das Öl unnötig auszubremsen. Riecht sogar noch nach Karton."
  },
  filter_blocked: {
    id: "filter_blocked",
    type: "filter",
    fits: ["filter"],
    name: "Zugesetzter Ölfilter",
    short: "Filter verstopft",
    spec: "Durchfluss fast null",
    icon: "filter",
    color: "#75685c",
    flow: 12,
    description: "Dieses Filterelement hat schon bessere Jahrzehnte gesehen. Das Öl kommt nur noch im Gänsemarsch hindurch."
  },
  relief_60: {
    id: "relief_60",
    type: "relief",
    fits: ["relief"],
    name: "Druckbegrenzer 60",
    short: "Begrenzer 60",
    spec: "öffnet bei 60 bar",
    icon: "relief",
    color: "#35c7e8",
    setting: 60,
    description: "Öffnet früh und schützt leichte Systeme. Für schwere Arbeit lässt er den Druck möglicherweise zu schnell entwischen."
  },
  relief_90: {
    id: "relief_90",
    type: "relief",
    fits: ["relief"],
    name: "Druckbegrenzer 90",
    short: "Begrenzer 90",
    spec: "öffnet bei 90 bar",
    icon: "relief",
    color: "#ffc84b",
    setting: 90,
    description: "Solider Schutz für normale Werkstattaufgaben. Hält den Kreislauf unterhalb von 90 bar."
  },
  relief_130: {
    id: "relief_130",
    type: "relief",
    fits: ["relief"],
    name: "Druckbegrenzer 130",
    short: "Begrenzer 130",
    spec: "öffnet bei 130 bar",
    icon: "relief",
    color: "#ff7043",
    setting: 130,
    description: "Für schwere Maschinen ausgelegt. Lässt genug Arbeitsdruck zu und schützt trotzdem vor Überdruck."
  }
};

const SLOT_INFO = {
  pump: { label: "Pumpenplatz", empty: "Pumpe fehlt" },
  supply: { label: "Druckleitung", empty: "Leitung fehlt" },
  control: { label: "Steuerblock", empty: "Ventil fehlt" },
  return: { label: "Rücklauf", empty: "Rücklauf fehlt" },
  filter: { label: "Filterplatz", empty: "Filter fehlt" },
  relief: { label: "Sicherheitszweig", empty: "Begrenzer fehlt" }
};

const MACHINE_COLORS = ["#59cee8", "#ff7b4f", "#b094ec", "#f6c44d", "#57ca89"];

const MISSIONS = [
  {
    id: "yard_lift",
    title: "Der müde Hoflift",
    location: "Hof Brösel",
    customer: "HB",
    difficulty: "Leicht",
    color: "#59cee8",
    machine: "lift",
    brief: "Der Hoflift hebt nur noch die Frühstücksdose. Und dabei klingt er wie ein hungriger Elch!",
    symptoms: ["Pumpe röchelt und gluckert", "Zylinder bewegt sich kaum", "Schauglas am Tank fast leer"],
    goal: "Bringe den Zylinder wieder bis zur grünen Markierung.",
    machineBubble: "Bitte nicht wieder mit dem Hammer!",
    successBubble: "Juhu! Hoch hinaus!",
    oil: 30,
    oilRange: [60, 80],
    requiredPressure: 75,
    successPressure: 82,
    baseReward: 300,
    initial: {
      pump: "pump_p40",
      supply: null,
      control: "valve_43",
      return: "hose_return",
      filter: "filter_clean",
      relief: "relief_90"
    },
    solution: {
      pump: "pump_p40",
      supply: "hose_pressure",
      control: "valve_43",
      return: "hose_return",
      filter: "filter_clean",
      relief: "relief_90"
    },
    inventory: ["hose_pressure", "hose_return", "valve_check", "valve_43"],
    hints: [
      "Folge der Leitung von der Pumpe: Der Weg zum grünen Steuerblock endet plötzlich.",
      "Eine röchelnde Pumpe und ein leeres Schauglas haben meistens denselben flüssigen Grund."
    ],
    inspections: {
      pump: "Die Pumpe ist mechanisch in Ordnung, zieht aber hörbar Luft mit an.",
      control: "Der Hebel schaltet sauber in Heben, Halt und Senken.",
      return: "Der blaue Schlauch führt frei zurück in den Tank.",
      filter: "Das Filterpapier ist hell und lässt Licht durch.",
      relief: "Die gelbe Einstellmarke steht auf 90 bar – passend für diesen Lift."
    },
    lesson: "Ein geschlossener Kreislauf braucht einen vollständigen Druckweg und genug Öl. Zieht die Pumpe Luft, kann sie keinen stabilen Druck aufbauen."
  },
  {
    id: "trash_press",
    title: "Rudis störrische Presse",
    location: "Recyclinghof Rudi",
    customer: "RR",
    difficulty: "Knifflig",
    color: "#ff7b4f",
    machine: "press",
    brief: "Rudi hat selbst ein glänzendes Ventil eingebaut. Seitdem fährt die Presse vor – und bleibt dort wie beleidigt stehen.",
    symptoms: ["Stempel fährt nicht zurück", "Öl wird schnell warm", "Rücklaufanschluss ist offen"],
    goal: "Lass den Pressstempel sicher vor- und zurückfahren.",
    machineBubble: "Vorwärts kann jeder!",
    successBubble: "Knack! Genau mein Ding!",
    oil: 80,
    oilRange: [70, 90],
    requiredPressure: 105,
    successPressure: 120,
    baseReward: 390,
    initial: {
      pump: "pump_p80",
      supply: "hose_pressure",
      control: "valve_check",
      return: null,
      filter: "filter_clean",
      relief: "relief_130"
    },
    solution: {
      pump: "pump_p80",
      supply: "hose_pressure",
      control: "valve_43",
      return: "hose_return",
      filter: "filter_clean",
      relief: "relief_130"
    },
    inventory: ["valve_43", "valve_32", "hose_return", "hose_pressure"],
    hints: [
      "Ein Rückschlagventil sperrt eine Richtung. Die Presse soll aber vor und zurück.",
      "Was in den Zylinder hineinfließt, braucht anschließend auch einen Weg zurück zum Tank."
    ],
    inspections: {
      pump: "Das Typenschild nennt 145 bar. Für die Presse ist genügend Kraft vorhanden.",
      supply: "Der rote Schlauch ist druckfest und ohne sichtbare Blasen.",
      control: "Das Bauteil trägt nur einen Richtungspfeil. Es kann den Zylinder nicht vollständig steuern.",
      filter: "Sauberer Filter, guter Durchfluss.",
      relief: "Der Begrenzer öffnet bei 130 bar und passt zur Kraftpumpe."
    },
    lesson: "Ein doppelt wirkender Zylinder benötigt eine Steuerung für beide Richtungen und einen freien Rücklauf. Ein Rückschlagventil allein kann das nicht leisten."
  },
  {
    id: "cookie_lift",
    title: "Keks-Katastrophe",
    location: "Knusper & Co.",
    customer: "KC",
    difficulty: "Knusprig",
    color: "#b094ec",
    machine: "cookies",
    brief: "Die Keksbühne hebt nur noch in Zeitlupe. Dafür wächst am roten Schlauch eine beeindruckende Beule.",
    symptoms: ["Beule in der Druckleitung", "Druck vor dem Filter hoch", "Zylinder schleicht"],
    goal: "Lass die Kekse zügig und ohne Schlauch-Ballon nach oben fahren.",
    machineBubble: "Die Kekse werden alt!",
    successBubble: "Frisch gehoben!",
    oil: 75,
    oilRange: [65, 85],
    requiredPressure: 78,
    successPressure: 86,
    baseReward: 460,
    initial: {
      pump: "pump_p40",
      supply: "hose_return",
      control: "valve_43",
      return: "hose_return",
      filter: "filter_blocked",
      relief: "relief_90"
    },
    solution: {
      pump: "pump_p40",
      supply: "hose_pressure",
      control: "valve_43",
      return: "hose_return",
      filter: "filter_clean",
      relief: "relief_90"
    },
    inventory: ["hose_pressure", "hose_return", "filter_clean", "valve_32"],
    hints: [
      "Bläht sich eine Leitung auf der Druckseite, ist sie vielleicht nur für den gemütlichen Rücklauf gedacht.",
      "Hoher Druck vor einem Bauteil und kaum Bewegung dahinter klingt nach einer Engstelle."
    ],
    inspections: {
      pump: "Die Standardpumpe läuft rund und reicht für die leichte Hebebühne.",
      supply: "Aufdruck: Rücklaufleitung, maximal 30 bar. An dieser Stelle kommen deutlich mehr an.",
      control: "Alle drei Schaltstellungen rasten sauber ein.",
      return: "Die blaue Rücklaufleitung ist hier genau richtig.",
      filter: "Das Element ist dunkel, schwer und beinahe vollständig zugesetzt.",
      relief: "Öffnet sauber bei 90 bar."
    },
    lesson: "Druck- und Rücklaufleitungen erfüllen unterschiedliche Aufgaben. Ein zugesetzter Filter bremst den Durchfluss – dadurch kann trotz Druck kaum Bewegung entstehen."
  },
  {
    id: "digger",
    title: "Berta hat keinen Biss",
    location: "Baugrube 7",
    customer: "B7",
    difficulty: "Schwer",
    color: "#f6c44d",
    machine: "digger",
    brief: "Bagger Berta hebt den Arm leer, aber beim ersten Stein gibt sie auf. Jemand hat beim Service besonders sparsam eingekauft.",
    symptoms: ["Ohne Last normale Bewegung", "Unter Last bleibt der Arm stehen", "Manometer stoppt bei 60 bar"],
    goal: "Gib Berta genug Arbeitsdruck für den schweren Stein – mit passender Absicherung.",
    machineBubble: "Der Stein guckt schon frech!",
    successBubble: "Berta beißt wieder!",
    oil: 85,
    oilRange: [75, 95],
    requiredPressure: 118,
    successPressure: 128,
    baseReward: 540,
    initial: {
      pump: "pump_p40",
      supply: "hose_pressure",
      control: "valve_43",
      return: "hose_return",
      filter: "filter_clean",
      relief: "relief_60"
    },
    solution: {
      pump: "pump_p80",
      supply: "hose_pressure",
      control: "valve_43",
      return: "hose_return",
      filter: "filter_clean",
      relief: "relief_130"
    },
    inventory: ["pump_p80", "pump_turbo", "relief_90", "relief_130", "hose_pressure"],
    hints: [
      "Wenn eine Anlage unbelastet fährt, aber unter Last stehen bleibt, fehlt häufig nicht der Weg – sondern die Kraft.",
      "Der Begrenzer bestimmt, wann der aufgebaute Druck wieder zum Tank entwischt. 60 bar sind für Berta zu früh."
    ],
    inspections: {
      pump: "Typenschild P-40: maximal 90 bar. Berta verlangt unter Last deutlich mehr.",
      supply: "Verstärkter 160-bar-Schlauch ohne Beschädigung.",
      control: "Das 4/3-Wegeventil lenkt in beide Arbeitsrichtungen.",
      return: "Freier Rücklauf ohne Knick.",
      filter: "Der Filter ist sauber.",
      relief: "Die Einstellmarke zeigt nur 60 bar. Danach wird jeder weitere Druck abgeleitet."
    },
    lesson: "Kraft entsteht durch ausreichenden Druck. Pumpe und Druckbegrenzung müssen beide zur Last passen – eine riesige Pumpe allein löst nicht jedes Problem."
  },
  {
    id: "scrap_monster",
    title: "Das Schrottmonster",
    location: "Geheime Halle X",
    customer: "HX",
    difficulty: "Meisterstück",
    color: "#57ca89",
    machine: "monster",
    brief: "Professor Rosts Sortiermonster spuckt Öl, kaut rückwärts und schläft mitten im Blechfrühstück ein. Ein ganz normaler Montag.",
    symptoms: ["Öl tritt am Tankdeckel aus", "Druckweg sichtbar unterbrochen", "Greifer nur in eine Richtung", "Druck bricht hinter Filter ein"],
    goal: "Repariere den kompletten Kreislauf und füttere das Monster gefahrlos mit Schrott.",
    machineBubble: "HUNGER! ...aber müde.",
    successBubble: "KNURPS! Mehr Schrott!",
    oil: 110,
    oilRange: [70, 90],
    requiredPressure: 115,
    successPressure: 126,
    baseReward: 700,
    initial: {
      pump: "pump_p80",
      supply: null,
      control: "valve_32",
      return: "hose_return",
      filter: "filter_blocked",
      relief: "relief_60"
    },
    solution: {
      pump: "pump_p80",
      supply: "hose_pressure",
      control: "valve_43",
      return: "hose_return",
      filter: "filter_clean",
      relief: "relief_130"
    },
    inventory: ["hose_pressure", "hose_return", "valve_43", "valve_check", "filter_clean", "relief_90", "relief_130"],
    hints: [
      "Bearbeite die Symptome einzeln: Tank, Druckweg, Bewegungsrichtungen, Filter und Druckgrenze.",
      "Das Monster braucht ungefähr 120 bar. Prüfe, ob der eingebaute Begrenzer diesen Druck überhaupt zulässt."
    ],
    inspections: {
      pump: "Die P-80 ist kräftig genug und läuft mechanisch ruhig.",
      control: "Das 3/2-Wegeventil bietet dem doppelt wirkenden Greifer nur eine Arbeitsrichtung.",
      return: "Der Rücklauf ist frei und endet sicher im Tank.",
      filter: "Das Filterelement ist komplett schwarz und fühlt sich schwer an.",
      relief: "Bei 60 bar öffnet der Begrenzer. Das reicht nicht für den Schrottgreifer."
    },
    lesson: "Bei mehreren Fehlern hilft eine klare Reihenfolge: Ölversorgung, geschlossener Kreislauf, Steuerung, freier Durchfluss und zuletzt der passende Arbeitsdruck."
  }
];

const elements = {};
let save = loadSave();
let currentMissionIndex = 0;
let run = null;
let selectedPartId = null;
let inspectedSlot = null;
let testing = false;
let toastTimer = null;
let audioContext = null;

document.addEventListener("DOMContentLoaded", init);

function init() {
  cacheElements();
  bindEvents();
  renderHome();
  updateHeader();
  registerServiceWorker();
}

function cacheElements() {
  const ids = [
    "homeScreen", "gameScreen", "brandButton", "totalBolts", "completedCount", "missionCount", "soundButton",
    "continueButton", "continueButtonText", "howToButton", "resetButton", "missionGrid", "backButton", "missionNumber",
    "missionName", "liveReward", "customerAvatar", "missionBrief", "symptomList", "missionGoal", "attemptCount", "hintButton",
    "hintText", "machineIllustration", "machineBubble", "hydraulicBoard", "circuit", "systemStatus", "oilVisual", "oilValue",
    "pressureValue", "gaugeNeedle", "cylinder", "selectionBanner", "selectedPartIcon", "selectedPartName", "cancelSelection",
    "testButton", "partsRack", "reservoirButton", "mobileActionBar", "mobileSelectionLabel", "mobileStatusLabel", "mobileTestButton",
    "toast", "howToDialog", "partDialog", "partDialogIcon", "partDialogSlot", "partDialogName", "partDialogDescription",
    "partDialogClue", "removePartButton", "oilDialog", "oilDialogFill", "oilDialogValue", "drainOilButton", "addOilButton",
    "testDialog", "testResultBadge", "testResultTitle", "testResultSummary", "testFindings", "testResultButton", "completeDialog",
    "completeTitle", "starRating", "earnedBolts", "lessonText", "nextMissionButton", "completeHomeButton", "confirmResetDialog",
    "confirmResetButton"
  ];
  ids.forEach((id) => { elements[id] = document.getElementById(id); });
  elements.slots = Array.from(document.querySelectorAll("[data-slot]"));
  elements.machineStage = document.querySelector(".machine-stage");
}

function bindEvents() {
  elements.brandButton.addEventListener("click", showHome);
  elements.backButton.addEventListener("click", showHome);
  elements.continueButton.addEventListener("click", () => startMission(getContinueMissionIndex()));
  elements.howToButton.addEventListener("click", () => openDialog(elements.howToDialog));
  elements.resetButton.addEventListener("click", () => openDialog(elements.confirmResetDialog));
  elements.confirmResetButton.addEventListener("click", resetProgress);
  elements.soundButton.addEventListener("click", toggleSound);
  elements.hintButton.addEventListener("click", revealHint);
  elements.reservoirButton.addEventListener("click", openOilDialog);
  elements.addOilButton.addEventListener("click", () => changeOil(10));
  elements.drainOilButton.addEventListener("click", () => changeOil(-10));
  elements.cancelSelection.addEventListener("click", clearPartSelection);
  elements.testButton.addEventListener("click", runTest);
  elements.mobileTestButton.addEventListener("click", runTest);
  elements.removePartButton.addEventListener("click", removeInspectedPart);
  elements.testResultButton.addEventListener("click", closeTestReport);
  elements.nextMissionButton.addEventListener("click", startNextMission);
  elements.completeHomeButton.addEventListener("click", () => { elements.completeDialog.close(); showHome(); });

  elements.slots.forEach((button) => button.addEventListener("click", () => handleSlotClick(button.dataset.slot)));

  document.querySelectorAll("[data-close-dialog]").forEach((button) => {
    button.addEventListener("click", () => {
      const dialog = button.closest("dialog");
      dialog?.close();
      if (dialog === elements.howToDialog) markTutorialSeen();
    });
  });

  document.querySelectorAll("dialog").forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog && dialog !== elements.testDialog && dialog !== elements.completeDialog) {
        dialog.close();
        if (dialog === elements.howToDialog) markTutorialSeen();
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && selectedPartId) clearPartSelection();
  });
}

function defaultSave() {
  return { unlocked: 1, completed: {}, bolts: 0, sound: true, tutorialSeen: false };
}

function loadSave() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!parsed || typeof parsed !== "object") return defaultSave();
    return { ...defaultSave(), ...parsed, completed: parsed.completed || {} };
  } catch {
    return defaultSave();
  }
}

function persistSave() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
}

function updateHeader() {
  elements.totalBolts.textContent = formatNumber(save.bolts);
  elements.completedCount.textContent = Object.keys(save.completed).length;
  elements.missionCount.textContent = MISSIONS.length;
  elements.soundButton.setAttribute("aria-pressed", String(save.sound));
}

function renderHome() {
  elements.missionGrid.innerHTML = MISSIONS.map((mission, index) => {
    const unlocked = index < save.unlocked;
    const record = save.completed[mission.id];
    const stars = record?.stars || 0;
    return `
      <button class="mission-card ${unlocked ? "" : "locked"}" style="--card-color:${mission.color}" data-mission="${index}" ${unlocked ? "" : "disabled"}>
        <div class="mission-card-art">
          <span class="mission-index">${String(index + 1).padStart(2, "0")}</span>
          ${machineSVG(mission.machine, true)}
          ${unlocked ? "" : '<span class="mission-lock" aria-label="Gesperrt">🔒</span>'}
        </div>
        <div class="mission-card-copy">
          <small>${mission.difficulty} · ${mission.location}</small>
          <h3>${mission.title}</h3>
          <p>${mission.symptoms[0]}</p>
          <div class="mission-card-footer">
            <span class="mission-stars" aria-label="${stars} von 3 Sternen">${renderStars(stars)}</span>
            <span class="mission-action">${record ? "Nochmal →" : unlocked ? "Starten →" : "Gesperrt"}</span>
          </div>
        </div>
      </button>`;
  }).join("");

  elements.missionGrid.querySelectorAll("[data-mission]").forEach((button) => {
    button.addEventListener("click", () => startMission(Number(button.dataset.mission)));
  });

  const next = getContinueMissionIndex();
  const allComplete = Object.keys(save.completed).length === MISSIONS.length;
  elements.continueButtonText.textContent = allComplete
    ? "Lieblingsauftrag spielen"
    : next === 0 && !save.completed[MISSIONS[0].id]
      ? "Ersten Auftrag starten"
      : "Nächsten Auftrag starten";
}

function getContinueMissionIndex() {
  const firstOpen = MISSIONS.findIndex((mission, index) => index < save.unlocked && !save.completed[mission.id]);
  if (firstOpen >= 0) return firstOpen;
  return Math.max(0, Math.min(save.unlocked - 1, MISSIONS.length - 1));
}

function startMission(index) {
  if (index < 0 || index >= MISSIONS.length || index >= save.unlocked) return;
  currentMissionIndex = index;
  const mission = MISSIONS[index];
  run = {
    slots: { ...mission.initial },
    oil: mission.oil,
    attempts: 0,
    hintsUsed: 0,
    wrongInstalls: 0,
    shownHints: []
  };
  testing = false;
  selectedPartId = null;
  inspectedSlot = null;
  resetVisualTestState();
  renderMission();
  showScreen("game");
  updateMobileBar();
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (!save.tutorialSeen) {
    window.setTimeout(() => openDialog(elements.howToDialog), 380);
  }
}

function renderMission() {
  const mission = MISSIONS[currentMissionIndex];
  elements.missionNumber.textContent = `Auftrag ${currentMissionIndex + 1} von ${MISSIONS.length}`;
  elements.missionName.textContent = mission.title;
  elements.customerAvatar.textContent = mission.customer;
  elements.missionBrief.textContent = mission.brief;
  elements.symptomList.innerHTML = mission.symptoms.map((symptom) => `<li>${symptom}</li>`).join("");
  elements.missionGoal.textContent = mission.goal;
  elements.machineIllustration.innerHTML = machineSVG(mission.machine, false);
  elements.machineBubble.textContent = mission.machineBubble;
  elements.attemptCount.textContent = run.attempts;
  elements.hintText.hidden = run.shownHints.length === 0;
  elements.hintText.innerHTML = run.shownHints.map((hint, index) => `<b>Hinweis ${index + 1}:</b> ${hint}`).join("<br><br>");
  elements.hintButton.disabled = run.hintsUsed >= mission.hints.length;
  renderSlots();
  renderPartsRack();
  renderOil();
  renderReward();
  updateSelectionUI();
  updateMobileBar();
}

function renderSlots() {
  elements.slots.forEach((button) => {
    const slot = button.dataset.slot;
    const partId = run.slots[slot];
    const part = partId ? PARTS[partId] : null;
    button.classList.toggle("empty", !part);
    button.style.removeProperty("--part-color");
    if (!part) {
      button.innerHTML = `<small>${SLOT_INFO[slot].empty}</small>`;
      button.setAttribute("aria-label", `${SLOT_INFO[slot].label}: leer`);
      return;
    }
    button.style.setProperty("--part-color", part.color);
    button.innerHTML = `<span class="part-icon">${partIcon(part.icon)}</span><b>${part.short}</b><small>${part.spec}</small>`;
    button.setAttribute("aria-label", `${SLOT_INFO[slot].label}: ${part.name}. Antippen zum Prüfen.`);
  });
}

function renderPartsRack() {
  const mission = MISSIONS[currentMissionIndex];
  elements.partsRack.innerHTML = mission.inventory.map((partId) => {
    const part = PARTS[partId];
    return `
      <button class="part-card ${selectedPartId === partId ? "selected" : ""}" data-part="${partId}" style="--part-color:${part.color}" type="button">
        <span class="part-icon">${partIcon(part.icon)}</span>
        <span><b>${part.name}</b><small>${part.spec}</small></span>
        <span>nehmen</span>
      </button>`;
  }).join("");

  elements.partsRack.querySelectorAll("[data-part]").forEach((button) => {
    button.addEventListener("click", () => selectPart(button.dataset.part));
  });
}

function selectPart(partId) {
  if (testing) return;
  selectedPartId = selectedPartId === partId ? null : partId;
  renderPartsRack();
  updateSelectionUI();
  updateMobileBar();
  playTone(selectedPartId ? "pick" : "tap");
  if (selectedPartId && window.innerWidth <= 900) {
    elements.hydraulicBoard.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function clearPartSelection() {
  selectedPartId = null;
  renderPartsRack();
  updateSelectionUI();
  updateMobileBar();
}

function updateSelectionUI() {
  const part = selectedPartId ? PARTS[selectedPartId] : null;
  elements.selectionBanner.hidden = !part;
  elements.slots.forEach((button) => {
    const slot = button.dataset.slot;
    const compatible = part?.fits.includes(slot);
    button.classList.toggle("compatible-target", Boolean(part && compatible));
    button.classList.toggle("incompatible-target", Boolean(part && !compatible));
  });
  if (!part) return;
  elements.selectedPartIcon.innerHTML = partIcon(part.icon);
  elements.selectedPartName.textContent = part.name;
}

function handleSlotClick(slot) {
  if (testing) return;
  if (selectedPartId) {
    const part = PARTS[selectedPartId];
    if (!part.fits.includes(slot)) {
      toast(`${part.short} passt nicht auf den Platz „${SLOT_INFO[slot].label}“.`);
      playTone("error");
      return;
    }
    const mission = MISSIONS[currentMissionIndex];
    const oldPart = run.slots[slot];
    run.slots[slot] = selectedPartId;
    if (selectedPartId !== mission.solution[slot]) run.wrongInstalls += 1;
    toast(oldPart ? `${PARTS[oldPart].short} gegen ${part.short} getauscht.` : `${part.short} eingebaut.`);
    playTone("install");
    selectedPartId = null;
    renderSlots();
    renderPartsRack();
    renderReward();
    updateSelectionUI();
    updateMobileBar();
    return;
  }

  if (!run.slots[slot]) {
    toast("Hier fehlt ein Teil. Wähle zuerst etwas aus dem Ersatzteillager.");
    elements.partsPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  inspectPart(slot);
}

function inspectPart(slot) {
  inspectedSlot = slot;
  const mission = MISSIONS[currentMissionIndex];
  const part = PARTS[run.slots[slot]];
  const correct = mission.solution[slot] === part.id;
  const clue = mission.inspections[slot] || (correct
    ? "Keine auffälligen Schäden oder falschen Kennzeichnungen entdeckt."
    : genericInspection(slot, part, mission));

  elements.partDialogIcon.style.background = part.color;
  elements.partDialogIcon.innerHTML = partIcon(part.icon);
  elements.partDialogSlot.textContent = SLOT_INFO[slot].label;
  elements.partDialogName.textContent = part.name;
  elements.partDialogDescription.textContent = part.description;
  elements.partDialogClue.textContent = clue;
  openDialog(elements.partDialog);
  playTone("tap");
}

function genericInspection(slot, part, mission) {
  if (slot === "pump") return `Auf dem Typenschild stehen maximal ${part.pressure} bar. Die Maschine braucht ungefähr ${mission.requiredPressure} bar unter Last.`;
  if (slot === "supply") return part.id === "hose_return" ? "Der Aufdruck nennt nur 30 bar. Auf der Druckseite beginnt der Schlauch bereits weich zu werden." : "Keine äußere Beschädigung sichtbar.";
  if (slot === "control") return part.id === "valve_check" ? "Der einzelne Pfeil verrät: Dieses Ventil sperrt den Rückweg, statt den Zylinder zu steuern." : "Die Anschlusszahl passt nicht zu beiden Zylinderseiten.";
  if (slot === "return") return "Die Leitung ist geknickt oder für diesen Anschluss ungeeignet.";
  if (slot === "filter") return part.id === "filter_blocked" ? "Das Filterelement ist pechschwarz und fast undurchlässig." : "Das Filtermaterial sieht sauber aus.";
  if (slot === "relief") return `Die Einstellmarke steht auf ${part.setting} bar; benötigt werden ungefähr ${mission.requiredPressure} bar.`;
  return "Das Bauteil wirkt verdächtig, aber die Ursache ist noch nicht eindeutig.";
}

function removeInspectedPart() {
  if (!inspectedSlot || testing) return;
  const removed = PARTS[run.slots[inspectedSlot]];
  run.slots[inspectedSlot] = null;
  elements.partDialog.close();
  toast(`${removed.name} ausgebaut. Der Platz ist jetzt frei.`);
  playTone("remove");
  inspectedSlot = null;
  renderSlots();
  updateSelectionUI();
}

function openOilDialog() {
  if (testing) return;
  renderOilDialog();
  openDialog(elements.oilDialog);
  playTone("tap");
}

function changeOil(delta) {
  run.oil = clamp(run.oil + delta, 0, 120);
  renderOil();
  renderOilDialog();
  playTone(delta > 0 ? "oil" : "tap");
}

function renderOil() {
  const percentage = clamp((run.oil / 120) * 100, 0, 100);
  elements.oilValue.textContent = run.oil;
  elements.oilVisual.style.height = `${percentage}%`;
}

function renderOilDialog() {
  const percentage = clamp((run.oil / 120) * 100, 0, 100);
  elements.oilDialogValue.textContent = run.oil;
  elements.oilDialogFill.style.width = `${percentage}%`;
  elements.addOilButton.disabled = run.oil >= 120;
  elements.drainOilButton.disabled = run.oil <= 0;
}

function revealHint() {
  const mission = MISSIONS[currentMissionIndex];
  if (run.hintsUsed >= mission.hints.length || testing) return;
  const hint = mission.hints[run.hintsUsed];
  run.hintsUsed += 1;
  run.shownHints.push(hint);
  elements.hintText.hidden = false;
  elements.hintText.innerHTML = run.shownHints.map((text, index) => `<b>Hinweis ${index + 1}:</b> ${text}`).join("<br><br>");
  elements.hintButton.disabled = run.hintsUsed >= mission.hints.length;
  renderReward();
  playTone("hint");
}

async function runTest() {
  if (testing || !run) return;
  testing = true;
  clearPartSelection();
  const mission = MISSIONS[currentMissionIndex];
  run.attempts += 1;
  elements.attemptCount.textContent = run.attempts;
  renderReward();
  setTestButtonsDisabled(true);

  const result = evaluateSystem(mission);
  setSystemStatus("testing", "Pumpe läuft … festhalten!");
  elements.machineStage.classList.remove("success");
  elements.machineStage.classList.add("testing");
  elements.circuit.classList.add("flowing");
  elements.circuit.classList.toggle("failed-flow", !result.success);
  elements.machineBubble.textContent = result.success ? "Oha … das fühlt sich gut an!" : "BRRRR… klonk… äh oh!";
  setGauge(Math.min(25, result.pressure));
  playTone("start");

  await wait(650);
  setGauge(result.pressure);
  if (result.movement === "partial") elements.cylinder.classList.add("partial");
  if (result.success) elements.cylinder.classList.add("extended");

  await wait(1400);
  elements.machineStage.classList.remove("testing");

  if (result.success) {
    elements.machineStage.classList.add("success");
    setSystemStatus("success", "System läuft rund!");
    elements.machineBubble.textContent = mission.successBubble;
    playTone("success");
    await wait(850);
    completeMission();
  } else {
    setSystemStatus("failed", result.status);
    elements.machineBubble.textContent = result.bubble;
    playTone("fail");
    showTestReport(result);
    testing = false;
    setTestButtonsDisabled(false);
  }
  updateMobileBar();
}

function evaluateSystem(mission) {
  const findings = [];
  const { slots, oil } = run;
  const [oilMin, oilMax] = mission.oilRange;

  if (oil < oilMin) {
    findings.push({ icon: "💨", title: "Pumpe zieht Luft", detail: "Der Ölstand ist zu niedrig. Der Druck zittert und bricht immer wieder zusammen.", key: "oil-low" });
  } else if (oil > oilMax) {
    findings.push({ icon: "🌊", title: "Tank läuft über", detail: "Beim Rücklauf hat das Öl keinen Platz mehr. Es drückt am Deckel nach draußen.", key: "oil-high" });
  }

  Object.keys(SLOT_INFO).forEach((slot) => {
    const actual = slots[slot];
    const expected = mission.solution[slot];
    if (actual === expected) return;
    findings.push(describeSlotFailure(slot, actual, expected, mission));
  });

  let pressure = 0;
  const pump = slots.pump ? PARTS[slots.pump] : null;
  if (pump) pressure = pump.pressure || 0;
  if (oil < oilMin) pressure *= clamp(oil / oilMin, 0.05, 1) * 0.72;
  if (!slots.supply) pressure = 0;
  if (slots.supply === "hose_return") pressure = Math.min(pressure, 28);
  if (!slots.control || slots.control === "valve_check") pressure = Math.min(pressure, 15);
  if (slots.control === "valve_32") pressure *= 0.55;
  if (slots.filter === "filter_blocked") pressure = Math.min(pressure * 0.72, 75);
  const relief = slots.relief ? PARTS[slots.relief] : null;
  if (relief?.setting) pressure = Math.min(pressure, relief.setting);
  if (!slots.return) pressure = Math.min(pressure * 1.12, 160);
  pressure = Math.round(clamp(pressure, 0, 160));

  const success = findings.length === 0;
  if (success) pressure = mission.successPressure;
  const canMove = Boolean(slots.pump && slots.supply && slots.control && slots.return && pressure >= mission.requiredPressure * 0.45);

  return {
    success,
    pressure,
    movement: success ? "full" : canMove ? "partial" : "none",
    findings,
    status: pressure === 0 ? "Kein Druck aufgebaut" : pressure < mission.requiredPressure ? "Druck oder Durchfluss zu gering" : "System unsicher",
    bubble: chooseFailureBubble(findings, pressure)
  };
}

function describeSlotFailure(slot, actualId, expectedId, mission) {
  if (!actualId) {
    const missing = {
      pump: ["⚙️", "Pumpe fehlt", "Ohne Pumpe wird das Öl keinen Zentimeter weit gefördert."],
      supply: ["🕳️", "Druckweg unterbrochen", "Zwischen Pumpe und Steuerblock fehlt eine belastbare Verbindung."],
      control: ["🚦", "Keine Steuerung", "Der Ölstrom erreicht den Zylinder nicht kontrolliert."],
      return: ["↩️", "Rückweg fehlt", "Das verdrängte Öl kann nicht sicher in den Tank zurückfließen."],
      filter: ["🧹", "Filterplatz offen", "Im Kreislauf fehlt der Schutz vor Schmutz."],
      relief: ["⚠️", "Überdruckschutz fehlt", "Der Kreislauf besitzt keine sichere Druckgrenze."]
    }[slot];
    return { icon: missing[0], title: missing[1], detail: missing[2], key: `${slot}-missing` };
  }

  const actual = PARTS[actualId];
  const expected = PARTS[expectedId];
  if (slot === "pump") {
    return actual.pressure < expected.pressure
      ? { icon: "🐭", title: "Pumpe zu schwach", detail: `${actual.short} schafft höchstens ${actual.pressure} bar. Unter Last reicht das nicht.`, key: "pump-weak" }
      : { icon: "🚀", title: "Pumpe überdimensioniert", detail: "Mehr Druck ist nicht automatisch besser. Die verbaute Pumpe passt nicht zur Absicherung.", key: "pump-strong" };
  }
  if (slot === "supply") return { icon: "🎈", title: "Falscher Schlauch auf Druckseite", detail: "Die Leitung ist nur für niedrigen Rücklaufdruck gedacht und beginnt sich sichtbar aufzublähen.", key: "supply-wrong" };
  if (slot === "control") {
    return actualId === "valve_check"
      ? { icon: "⛔", title: "Ölstrom einseitig gesperrt", detail: "Das Rückschlagventil ersetzt keine Zylindersteuerung für beide Richtungen.", key: "control-check" }
      : { icon: "↪️", title: "Eine Richtung fehlt", detail: "Dieses Ventil kann den doppelt wirkenden Zylinder nicht vollständig aus- und einfahren.", key: "control-wrong" };
  }
  if (slot === "return") return { icon: "🌀", title: "Rücklauf ungeeignet", detail: "Das Öl kann nicht ruhig und sicher zum Tank zurückströmen.", key: "return-wrong" };
  if (slot === "filter") return { icon: "🧱", title: "Filter nahezu dicht", detail: "Vor dem Filter steigt der Druck, dahinter fehlt der nötige Durchfluss für Bewegung.", key: "filter-blocked" };
  if (slot === "relief") {
    return actual.setting < mission.requiredPressure
      ? { icon: "📉", title: "Druck wird zu früh abgeleitet", detail: `Der Begrenzer öffnet schon bei ${actual.setting} bar. Die Maschine braucht ungefähr ${mission.requiredPressure} bar.`, key: "relief-low" }
      : { icon: "📈", title: "Druckgrenze zu hoch", detail: "Die eingestellte Sicherheitsgrenze passt nicht zu den übrigen Bauteilen.", key: "relief-high" };
  }
  return { icon: "?", title: "Bauteil passt nicht", detail: `${actual.name} erfüllt an diesem Platz nicht die benötigte Aufgabe.`, key: `${slot}-wrong` };
}

function chooseFailureBubble(findings, pressure) {
  const first = findings[0]?.key || "unknown";
  if (first === "oil-low") return "Gluck… ich habe Durst!";
  if (first === "oil-high") return "Hilfe, ich laufe aus!";
  if (first.includes("missing")) return "Da fehlt doch was?!";
  if (first.includes("filter")) return "Ich kriege nichts durch!";
  if (first.includes("relief") || first.includes("pump")) return "Mehr Kraft, bitte!";
  if (first.includes("control")) return "Vor, zurück… ich bin verwirrt!";
  if (pressure === 0) return "Null Druck. Null Spaß.";
  return "Fast … aber noch nicht rund!";
}

function showTestReport(result) {
  elements.testResultBadge.className = "result-badge";
  elements.testResultBadge.textContent = `TEST ${run.attempts} · ${result.pressure} BAR`;
  elements.testResultTitle.textContent = result.pressure === 0 ? "Da kommt kein Druck an." : "Da stimmt noch etwas nicht.";
  elements.testResultSummary.textContent = `Der Prüfstand hat ${result.findings.length} ${result.findings.length === 1 ? "Problem" : "Probleme"} bemerkt. Nutze die Beobachtungen – sie verraten die Lösung, ohne sie direkt vorzusagen.`;
  elements.testFindings.innerHTML = result.findings.slice(0, 4).map((finding) => `
    <div class="finding"><span>${finding.icon}</span><div><b>${finding.title}</b><small>${finding.detail}</small></div></div>
  `).join("");
  openDialog(elements.testDialog);
}

function closeTestReport() {
  elements.testDialog.close();
  resetVisualTestState(false);
  setSystemStatus("idle", "Bereit für den nächsten Versuch");
  updateMobileBar();
}

function resetVisualTestState(resetGauge = true) {
  elements.machineStage?.classList.remove("testing", "success");
  elements.circuit?.classList.remove("flowing", "failed-flow");
  elements.cylinder?.classList.remove("extended", "partial");
  if (resetGauge) setGauge(0);
  if (elements.machineBubble && MISSIONS[currentMissionIndex]) elements.machineBubble.textContent = MISSIONS[currentMissionIndex].machineBubble;
  if (elements.systemStatus) setSystemStatus("idle", "Bereit zur Diagnose");
}

function setSystemStatus(state, text) {
  elements.systemStatus.className = `system-status ${state}`;
  elements.systemStatus.querySelector("span").textContent = text;
  elements.mobileStatusLabel.textContent = text;
}

function setGauge(pressure) {
  if (!elements.gaugeNeedle) return;
  const angle = -120 + clamp(pressure / 160, 0, 1) * 240;
  elements.gaugeNeedle.style.transform = `rotate(${angle}deg)`;
  elements.pressureValue.textContent = Math.round(pressure);
}

function setTestButtonsDisabled(disabled) {
  elements.testButton.disabled = disabled;
  elements.mobileTestButton.disabled = disabled;
  elements.hintButton.disabled = disabled || run.hintsUsed >= MISSIONS[currentMissionIndex].hints.length;
}

function calculateReward() {
  const mission = MISSIONS[currentMissionIndex];
  const failedTests = Math.max(0, run.attempts - 1);
  return Math.max(Math.round(mission.baseReward * 0.42), mission.baseReward - failedTests * 35 - run.hintsUsed * 25 - run.wrongInstalls * 8);
}

function renderReward() {
  elements.liveReward.textContent = calculateReward();
}

function completeMission() {
  const mission = MISSIONS[currentMissionIndex];
  const reward = calculateReward();
  const ratio = reward / mission.baseReward;
  const stars = ratio >= 0.9 ? 3 : ratio >= 0.72 ? 2 : 1;
  const previous = save.completed[mission.id] || { reward: 0, stars: 0 };
  const addedBolts = Math.max(0, reward - previous.reward);

  save.bolts += addedBolts;
  save.completed[mission.id] = {
    reward: Math.max(previous.reward, reward),
    stars: Math.max(previous.stars, stars)
  };
  save.unlocked = Math.min(MISSIONS.length, Math.max(save.unlocked, currentMissionIndex + 2));
  persistSave();
  updateHeader();

  elements.completeTitle.textContent = mission.successBubble;
  elements.starRating.innerHTML = [1, 2, 3].map((number) => `<span class="${number <= stars ? "earned" : ""}">★</span>`).join("");
  elements.earnedBolts.textContent = addedBolts;
  elements.lessonText.innerHTML = `<b>Werkstatt-Wissen:</b> ${mission.lesson}`;
  elements.nextMissionButton.hidden = currentMissionIndex >= MISSIONS.length - 1;
  elements.nextMissionButton.textContent = save.completed[MISSIONS.at(-1).id] && currentMissionIndex === MISSIONS.length - 1 ? "Fertig" : "Nächster Auftrag →";
  openDialog(elements.completeDialog);
  testing = false;
  setTestButtonsDisabled(false);
}

function startNextMission() {
  elements.completeDialog.close();
  if (currentMissionIndex < MISSIONS.length - 1) startMission(currentMissionIndex + 1);
  else showHome();
}

function updateMobileBar() {
  const inGame = elements.gameScreen.classList.contains("active");
  elements.mobileActionBar.hidden = !inGame;
  if (!inGame || !run) return;
  const part = selectedPartId ? PARTS[selectedPartId] : null;
  elements.mobileSelectionLabel.textContent = part ? "Teil in der Hand" : `Belohnung: ${calculateReward()} Schrauben`;
  if (part) elements.mobileStatusLabel.textContent = part.name;
  else if (!testing && !elements.systemStatus.classList.contains("failed")) elements.mobileStatusLabel.textContent = "Prüfstand bereit";
}

function showHome() {
  if (testing) return;
  document.querySelectorAll("dialog[open]").forEach((dialog) => dialog.close());
  clearPartSelection();
  showScreen("home");
  renderHome();
  updateHeader();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showScreen(name) {
  const gameActive = name === "game";
  elements.homeScreen.classList.toggle("active", !gameActive);
  elements.gameScreen.classList.toggle("active", gameActive);
  elements.mobileActionBar.hidden = !gameActive;
}

function resetProgress() {
  save = defaultSave();
  persistSave();
  elements.confirmResetDialog.close();
  renderHome();
  updateHeader();
  toast("Werkstatt zurückgesetzt. Alles riecht wieder nach Neuanfang.");
}

function markTutorialSeen() {
  if (save.tutorialSeen) return;
  save.tutorialSeen = true;
  persistSave();
}

function toggleSound() {
  save.sound = !save.sound;
  persistSave();
  updateHeader();
  if (save.sound) playTone("pick");
}

function openDialog(dialog) {
  if (!dialog.open) dialog.showModal();
}

function toast(message) {
  window.clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("visible");
  toastTimer = window.setTimeout(() => elements.toast.classList.remove("visible"), 2600);
}

function playTone(kind) {
  if (!save.sound) return;
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    const now = audioContext.currentTime;
    const notes = {
      tap: [250, 0.04, "sine"],
      pick: [420, 0.06, "triangle"],
      install: [330, 0.08, "square"],
      remove: [185, 0.08, "triangle"],
      oil: [520, 0.08, "sine"],
      hint: [660, 0.12, "sine"],
      error: [130, 0.1, "sawtooth"],
      start: [90, 0.3, "sawtooth"],
      fail: [150, 0.34, "square"],
      success: [660, 0.16, "triangle"]
    };
    const [frequency, duration, type] = notes[kind] || notes.tap;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    if (kind === "start") oscillator.frequency.exponentialRampToValueAtTime(230, now + duration);
    if (kind === "fail") oscillator.frequency.exponentialRampToValueAtTime(75, now + duration);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.075, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);

    if (kind === "success") {
      window.setTimeout(() => playTone("hint"), 130);
    }
  } catch {
    // Audio is optional. The game remains fully usable when a browser blocks it.
  }
}

function partIcon(type) {
  const common = 'fill="none" stroke="#142d3d" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"';
  const icons = {
    pump: `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="14" fill="#fff8e7" stroke="#142d3d" stroke-width="3.2"/><path d="M8 24H3M45 24h-5M24 10V5" ${common}/><path d="m18 31 13-7-13-7Z" fill="#ff7043" stroke="#142d3d" stroke-width="3"/></svg>`,
    hose: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 12v8c0 12 9 17 18 17s18-5 18-17v-8" ${common}/><path d="M2 7h8v9H2zM38 7h8v9h-8z" fill="#fff8e7" stroke="#142d3d" stroke-width="3"/><path d="M12 25c5 3 6 7 7 11" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>`,
    valve: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M5 13h38v24H5z" fill="#fff8e7" stroke="#142d3d" stroke-width="3"/><path d="M18 13v24M30 13v24M8 25h7m-3-4 4 4-4 4M21 30l6-10m-4 1 4-1 1 4M33 25h7" ${common}/></svg>`,
    check: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M5 24h12M31 24h12" ${common}/><path d="m17 13 14 11-14 11Z" fill="#fff8e7" stroke="#142d3d" stroke-width="3"/><path d="M31 13v22" ${common}/></svg>`,
    filter: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 5 42 24 24 43 6 24Z" fill="#fff8e7" stroke="#142d3d" stroke-width="3"/><path d="m16 17 16 14M12 24h24M16 31l16-14" ${common}/></svg>`,
    relief: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M7 35h34M11 35V13h26v22" ${common}/><path d="m16 18 5 5-5 5 5 5 5-5-5-5 5-5" ${common}/><path d="M31 16v15m-4-4 4 4 4-4" ${common}/></svg>`
  };
  return icons[type] || icons.valve;
}

function machineSVG(type, compact = false) {
  const ink = "#142d3d";
  const stroke = `stroke="${ink}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"`;
  const commonStart = `<svg viewBox="0 0 360 170" aria-hidden="true">`;
  const commonEnd = `</svg>`;
  const drawings = {
    lift: `${commonStart}<path d="M39 139h281" ${stroke}/><rect x="71" y="118" width="216" height="23" rx="8" fill="#667f8d" ${stroke}/><circle cx="102" cy="145" r="13" fill="#263e4d" ${stroke}/><circle cx="257" cy="145" r="13" fill="#263e4d" ${stroke}/><path d="m114 117 62-78m0 78-62-78m70 78 62-78m0 78-62-78" fill="none" ${stroke}/><rect x="82" y="27" width="194" height="21" rx="5" fill="#ffc84b" ${stroke}/><path d="M95 27V10h14v17m139 0V10h14v17" ${stroke} fill="#ff7043"/><rect x="201" y="3" width="42" height="24" rx="4" fill="#d99b57" ${stroke}/><path d="M210 3v24m22-24v24" ${stroke}/><circle cx="172" cy="87" r="10" fill="#35c7e8" ${stroke}/></svg>`,
    press: `${commonStart}<path d="M48 145h265" ${stroke}/><rect x="91" y="19" width="178" height="125" rx="9" fill="#ff7043" ${stroke}/><rect x="108" y="37" width="144" height="89" rx="5" fill="#f7ead4" ${stroke}/><path d="M180 39v42" ${stroke}/><rect x="145" y="77" width="70" height="19" rx="4" fill="#667f8d" ${stroke}/><path d="M122 117h116" ${stroke}/><rect x="116" y="122" width="128" height="18" rx="5" fill="#ffc84b" ${stroke}/><circle cx="242" cy="31" r="8" fill="#52c988" ${stroke}/><path d="M70 55h21m178 0h21M70 92h21m178 0h21" ${stroke}/></svg>`,
    cookies: `${commonStart}<path d="M31 142h299" ${stroke}/><rect x="43" y="102" width="271" height="30" rx="14" fill="#667f8d" ${stroke}/><circle cx="75" cy="117" r="10" fill="#d9e3e2" ${stroke}/><circle cx="126" cy="117" r="10" fill="#d9e3e2" ${stroke}/><circle cx="177" cy="117" r="10" fill="#d9e3e2" ${stroke}/><circle cx="228" cy="117" r="10" fill="#d9e3e2" ${stroke}/><circle cx="279" cy="117" r="10" fill="#d9e3e2" ${stroke}/><path d="M101 102V51h155v51" fill="none" ${stroke}/><rect x="88" y="39" width="181" height="18" rx="4" fill="#b094ec" ${stroke}/><path d="m129 100 22-45m44 45 22-45" ${stroke}/><g fill="#d99b57" stroke="${ink}" stroke-width="3"><circle cx="83" cy="94" r="13"/><circle cx="119" cy="92" r="13"/><circle cx="249" cy="93" r="13"/></g><g fill="${ink}"><circle cx="78" cy="90" r="2"/><circle cx="88" cy="97" r="2"/><circle cx="115" cy="87" r="2"/><circle cx="124" cy="97" r="2"/><circle cx="246" cy="89" r="2"/><circle cx="255" cy="97" r="2"/></g></svg>`,
    digger: `${commonStart}<path d="M37 146h284" ${stroke}/><path d="M79 113h128l35 29H61Z" fill="#667f8d" ${stroke}/><rect x="92" y="84" width="101" height="42" rx="8" fill="#ffc84b" ${stroke}/><path d="M107 84V44h58l28 40" fill="#ffc84b" ${stroke}/><path d="M116 52h42l20 31h-62Z" fill="#9ee7f4" ${stroke}/><path d="m182 74 52-42 17 13-40 67" fill="none" ${stroke}/><path d="m233 33 37-20 12 15-32 24" fill="#ffc84b" ${stroke}/><path d="m280 27 26 20-20 32-34-22Z" fill="#ff7043" ${stroke}/><circle cx="102" cy="142" r="18" fill="#263e4d" ${stroke}/><circle cx="194" cy="142" r="18" fill="#263e4d" ${stroke}/><circle cx="102" cy="142" r="6" fill="#f7ead4"/><circle cx="194" cy="142" r="6" fill="#f7ead4"/></svg>`,
    monster: `${commonStart}<path d="M29 146h302" ${stroke}/><rect x="77" y="55" width="206" height="87" rx="25" fill="#57ca89" ${stroke}/><path d="m103 55-19-30 42 16m131 14 19-30-42 16" fill="#ffc84b" ${stroke}/><circle cx="126" cy="83" r="15" fill="#fff" ${stroke}/><circle cx="234" cy="83" r="15" fill="#fff" ${stroke}/><circle cx="130" cy="86" r="5" fill="${ink}"/><circle cx="230" cy="86" r="5" fill="${ink}"/><path d="M122 112h116l-14 28h-88Z" fill="#263e4d" ${stroke}/><path d="m140 113 12 17 13-17 14 17 14-17 14 17 13-17" fill="#fff" ${stroke}/><path d="M77 90 35 70m248 20 42-20" ${stroke}/><circle cx="103" cy="144" r="17" fill="#667f8d" ${stroke}/><circle cx="258" cy="144" r="17" fill="#667f8d" ${stroke}/></svg>`
  };
  const svg = drawings[type] || drawings.lift;
  return compact ? svg.replace('viewBox="0 0 360 170"', 'viewBox="20 0 320 170"') : svg;
}

function renderStars(count) {
  return [1, 2, 3].map((number) => `<span class="${number <= count ? "earned" : ""}">★</span>`).join("");
}

function formatNumber(value) {
  return new Intl.NumberFormat("de-DE").format(value);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function wait(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }
}
