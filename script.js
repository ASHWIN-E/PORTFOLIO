"use strict";

const CONTACT_EMAIL = "your.email@example.com";
const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("[data-navigation]");
const navigationLinks = [...document.querySelectorAll(".nav-link")];
const revealItems = [...document.querySelectorAll("[data-reveal]")];
const progressBar = document.querySelector("[data-scroll-progress]");
const pointerGlow = document.querySelector("[data-pointer-glow]");
const toast = document.querySelector("[data-toast]");
let toastTimer;

function showToast(message) {
  if (!toast) return;
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2800);
}

function setMenu(open) {
  if (!menuToggle || !navigation) return;
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  navigation.classList.toggle("open", open);
  document.body.classList.toggle("dialog-open", open);
}

menuToggle?.addEventListener("click", () => {
  setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
});

navigationLinks.forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle?.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    menuToggle.focus();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 980) setMenu(false);
});

function updateOnScroll() {
  const scrollTop = window.scrollY;
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? Math.min(scrollTop / scrollableHeight, 1) : 0;

  header?.classList.toggle("scrolled", scrollTop > 24);
  if (progressBar) progressBar.style.transform = `scaleX(${progress})`;
}

window.addEventListener("scroll", updateOnScroll, { passive: true });
updateOnScroll();

if ("IntersectionObserver" in window && !reduceMotionQuery.matches) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -4% 0px" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("revealed"));
}

if ("IntersectionObserver" in window) {
  const navSections = navigationLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navigationLinks.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", isActive);
          if (isActive) link.setAttribute("aria-current", "page");
          else link.removeAttribute("aria-current");
        });
      });
    },
    { threshold: 0, rootMargin: "-42% 0px -48% 0px" }
  );

  navSections.forEach((section) => sectionObserver.observe(section));
}

if (!reduceMotionQuery.matches && window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("pointermove", (event) => {
    document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
    document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
  }, { passive: true });

  requestAnimationFrame(() => pointerGlow?.classList.add("visible"));

  const tiltStage = document.querySelector("[data-tilt]");
  const tiltCard = tiltStage?.querySelector(".ai-console");

  tiltStage?.addEventListener("pointermove", (event) => {
    if (!tiltCard) return;
    const bounds = tiltStage.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
    tiltCard.style.transform = `rotateY(${horizontal * 5}deg) rotateX(${vertical * -5}deg) translateZ(0)`;
  });

  tiltStage?.addEventListener("pointerleave", () => {
    if (tiltCard) tiltCard.style.transform = "";
  });

  document.querySelectorAll("[data-tilt-card]").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const horizontal = event.clientX - bounds.left - bounds.width / 2;
      const vertical = event.clientY - bounds.top - bounds.height / 2;
      card.style.transform = `perspective(900px) rotateX(${-vertical * 0.018}deg) rotateY(${horizontal * 0.018}deg) translateY(-5px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const projectData = {
  ewaste: {
    code: "PROJECT / 01",
    kicker: "E-WASTE / PROTOTYPE CONCEPT",
    title: "E-Waste Smart Collection System",
    description: "A smart prototype concept designed to encourage people to return unused electronic products and promote responsible e-waste recycling. The project explores how technology can make participating in a circular electronics lifecycle more accessible and meaningful.",
    tags: ["IoT", "Artificial Intelligence", "Automation", "Sustainability"],
    focus: "Responsible digital collection",
    stage: "Prototype concept",
    symbol: "icon-leaf"
  },
  ai: {
    code: "PROJECT / 02",
    kicker: "GENERATIVE AI / PRACTICAL SOLUTIONS",
    title: "AI-Based Project",
    description: "An AI-focused exploration demonstrating how Generative AI can be used to create useful and practical solutions. The focus is on experimenting with prompts, structured workflows, and responsible ways to connect AI capabilities with everyday needs.",
    tags: ["Python", "Generative AI", "Artificial Intelligence", "Problem Solving"],
    focus: "Useful AI workflows",
    stage: "Learning exploration",
    symbol: "icon-bot"
  }
};

const projectDialog = document.querySelector("[data-project-dialog]");
const dialogClose = document.querySelector("[data-dialog-close]");

function populateProjectDialog(key) {
  const project = projectData[key];
  if (!project || !projectDialog) return;

  projectDialog.querySelector("[data-dialog-code]").textContent = project.code;
  projectDialog.querySelector("[data-dialog-kicker]").textContent = project.kicker;
  projectDialog.querySelector("[data-dialog-title]").textContent = project.title;
  projectDialog.querySelector("[data-dialog-description]").textContent = project.description;
  projectDialog.querySelector("[data-dialog-focus]").textContent = project.focus;
  projectDialog.querySelector("[data-dialog-stage]").textContent = project.stage;
  projectDialog.querySelector("[data-dialog-symbol] use")?.setAttribute("href", `#${project.symbol}`);

  const tagContainer = projectDialog.querySelector("[data-dialog-tags]");
  tagContainer.replaceChildren(...project.tags.map((tag) => {
    const span = document.createElement("span");
    span.textContent = tag;
    return span;
  }));
}

function openProjectDialog(key) {
  populateProjectDialog(key);
  if (!projectDialog) return;

  if (typeof projectDialog.showModal === "function") {
    projectDialog.showModal();
  } else {
    projectDialog.setAttribute("open", "");
  }
  document.body.classList.add("dialog-open");
}

function closeProjectDialog() {
  if (!projectDialog) return;
  if (typeof projectDialog.close === "function" && projectDialog.open) projectDialog.close();
  else projectDialog.removeAttribute("open");
  document.body.classList.remove("dialog-open");
}

document.querySelectorAll("[data-project-open]").forEach((button) => {
  button.addEventListener("click", () => openProjectDialog(button.dataset.projectOpen));
});

dialogClose?.addEventListener("click", closeProjectDialog);
projectDialog?.querySelector("[data-dialog-contact]")?.addEventListener("click", closeProjectDialog);
projectDialog?.addEventListener("click", (event) => {
  if (event.target === projectDialog) closeProjectDialog();
});
projectDialog?.addEventListener("close", () => document.body.classList.remove("dialog-open"));

const contactForm = document.querySelector("[data-contact-form]");

if (contactForm) {
  const fields = [...contactForm.querySelectorAll("input, textarea")];
  const formStatus = contactForm.querySelector("[data-form-status]");

  const validateField = (field) => {
    const fieldWrapper = field.closest(".form-field");
    const valid = field.checkValidity();
    fieldWrapper?.classList.toggle("invalid", !valid);
    return valid;
  };

  fields.forEach((field) => {
    field.addEventListener("input", () => {
      if (field.closest(".form-field")?.classList.contains("invalid")) validateField(field);
    });
    field.addEventListener("blur", () => validateField(field));
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const isValid = fields.map(validateField).every(Boolean);

    if (!isValid) {
      formStatus.textContent = "Please complete the highlighted fields.";
      formStatus.className = "form-response error";
      contactForm.querySelector(".form-field.invalid input, .form-field.invalid textarea")?.focus();
      return;
    }

    const data = new FormData(contactForm);
    const name = data.get("name").trim();
    const email = data.get("email").trim();
    const subject = data.get("subject").trim();
    const message = data.get("message").trim();

    if (CONTACT_EMAIL.includes("example.com")) {
      formStatus.textContent = "Preview mode: update CONTACT_EMAIL in script.js before sending messages.";
      formStatus.className = "form-response error";
      showToast("One final setup step: add your real email in script.js.");
      return;
    }

    const subjectLine = encodeURIComponent(`Portfolio message from ${name}: ${subject}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
    formStatus.textContent = "Your email app is opening with the message ready to send.";
    formStatus.className = "form-response success";
    showToast("Opening your email app…");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subjectLine}&body=${body}`;
  });
}

function initProjectQuest() {
  const quest = document.querySelector("[data-game]");
  const canvas = quest?.querySelector("[data-game-canvas]");
  const context = canvas?.getContext("2d");
  if (!quest || !canvas || !context) return;

  const startScreen = quest.querySelector("[data-game-start-screen]");
  const resultScreen = quest.querySelector("[data-game-result-screen]");
  const startButton = quest.querySelector("[data-game-start]");
  const pauseButton = quest.querySelector("[data-game-pause]");
  const restartButton = quest.querySelector("[data-game-restart]");
  const viewButton = quest.querySelector("[data-game-view]");
  const skipButton = quest.querySelector("[data-game-skip]");
  const leftButton = quest.querySelector('[data-game-control="left"]');
  const rightButton = quest.querySelector('[data-game-control="right"]');
  const distanceOutput = quest.querySelector("[data-game-distance]");
  const signalOutput = quest.querySelector("[data-game-signals]");
  const integrityOutput = quest.querySelector("[data-game-integrity]");
  const healthBar = quest.querySelector("[data-game-health]");
  const progressOutput = quest.querySelector("[data-game-progress]");
  const flash = quest.querySelector("[data-game-flash]");
  const gameStatus = quest.querySelector("[data-game-status]");
  const questBadge = document.querySelector("[data-quest-badge]");
  const projectGrid = document.querySelector("[data-project-grid]");
  const storageKey = "ashwin-project-quest-complete";

  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let animationFrame = 0;
  let lastTime = 0;
  let touchStartX = null;
  let hasCompletedBefore = false;

  const state = {
    mode: "idle",
    lane: 1,
    playerX: 0,
    progress: 0,
    signals: 0,
    integrity: 100,
    entities: [],
    spawnTimer: 0.45,
    spawnIndex: 0,
    elapsed: 0,
    frameDistance: 0,
    shake: 0
  };

  try {
    hasCompletedBefore = localStorage.getItem(storageKey) === "true";
  } catch {
    hasCompletedBefore = false;
  }

  function roadBounds() {
    const left = Math.max(18, width * 0.11);
    const right = Math.min(width - 18, width * 0.89);
    return { left, right, laneWidth: (right - left) / 4 };
  }

  function laneX(lane) {
    const road = roadBounds();
    return road.left + road.laneWidth * (lane + 0.5);
  }

  function resizeCanvas() {
    const bounds = canvas.getBoundingClientRect();
    width = bounds.width;
    height = bounds.height;
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    state.playerX = laneX(state.lane);
  }

  if ("ResizeObserver" in window) {
    new ResizeObserver(resizeCanvas).observe(canvas);
  } else {
    window.addEventListener("resize", resizeCanvas);
  }
  resizeCanvas();

  function updateControlButtons() {
    leftButton.disabled = state.lane === 0 || state.mode === "success" || state.mode === "failed";
    rightButton.disabled = state.lane === 3 || state.mode === "success" || state.mode === "failed";
  }

  function updatePauseButton() {
    const paused = state.mode === "paused";
    pauseButton.disabled = state.mode === "idle" || state.mode === "success" || state.mode === "failed";
    pauseButton.setAttribute("aria-label", paused ? "Resume game" : "Pause game");
    pauseButton.querySelector("use")?.setAttribute("href", paused ? "#icon-play" : "#icon-pause");
  }

  function updateHud() {
    const percent = Math.min(100, Math.floor(state.progress * 100));
    distanceOutput.textContent = `${percent}%`;
    signalOutput.textContent = String(state.signals);
    integrityOutput.textContent = `${state.integrity}%`;
    healthBar.style.transform = `scaleX(${state.integrity / 100})`;
    healthBar.style.background = state.integrity <= 50
      ? "linear-gradient(90deg, #fb7185, #f59e0b)"
      : "linear-gradient(90deg, #6ee7b7, #22d3ee)";
    progressOutput.style.transform = `scaleX(${state.progress})`;
    updateControlButtons();
  }

  function moveLane(direction) {
    if (state.mode !== "running" && state.mode !== "paused") return;
    state.lane = Math.max(0, Math.min(3, state.lane + direction));
    state.playerX = laneX(state.lane);
    updateControlButtons();
  }

  function resetGame() {
    state.mode = "idle";
    state.lane = 1;
    state.playerX = laneX(1);
    state.progress = 0;
    state.signals = 0;
    state.integrity = 100;
    state.entities = [];
    state.spawnTimer = 0.45;
    state.spawnIndex = 0;
    state.elapsed = 0;
    state.frameDistance = 0;
    state.shake = 0;
    lastTime = performance.now();
    startScreen.hidden = false;
    resultScreen.hidden = true;
    resultScreen.classList.remove("is-failure");
    gameStatus.textContent = "Game ready.";
    updateHud();
    updatePauseButton();
  }

  function startGame() {
    resetGame();
    state.mode = "running";
    startScreen.hidden = true;
    gameStatus.textContent = "Drive started. Collect energy signals and avoid glitches.";
    updatePauseButton();
    updateHud();
    canvas.focus({ preventScroll: true });
  }

  function pauseGame() {
    if (state.mode === "running") {
      state.mode = "paused";
      gameStatus.textContent = "Game paused.";
    } else if (state.mode === "paused") {
      state.mode = "running";
      lastTime = performance.now();
      gameStatus.textContent = "Game resumed.";
    }
    updatePauseButton();
  }

  function markQuestComplete() {
    questBadge.hidden = false;
    document.documentElement.classList.add("projects-unlocked");
    document.querySelectorAll("[data-project-card]").forEach((card) => card.classList.add("quest-revealed"));
    try {
      localStorage.setItem(storageKey, "true");
    } catch {
      // The completion still works when storage is unavailable.
    }
  }

  function finishGame(success, reason = "") {
    state.mode = success ? "success" : "failed";
    startScreen.hidden = true;
    resultScreen.hidden = false;
    resultScreen.classList.toggle("is-failure", !success);
    resultScreen.querySelector("[data-game-result-label]").textContent = success ? "ROUTE COMPLETE" : "SIGNAL INTERRUPTED";
    resultScreen.querySelector("[data-game-result-title]").textContent = success ? "Project signal found!" : "The route needs another try.";
    resultScreen.querySelector("[data-game-result-copy]").textContent = success
      ? state.signals === 3
        ? "You collected all three signals. The project coordinates are ready."
        : "You reached the finish. The project coordinates are ready to explore."
      : reason || "The car integrity reached zero. Restart the drive and try another route.";
    gameStatus.textContent = success ? "Project signal found. Projects are ready to view." : "Game over. You can restart the route.";
    updatePauseButton();
    updateHud();

    if (success) {
      markQuestComplete();
      showToast("Project signal found — coordinates revealed!");
    }
  }

  function spawnEntity() {
    const guaranteedSignal = [0, 3, 6].includes(state.spawnIndex);
    const type = guaranteedSignal || Math.random() > 0.38 ? "signal" : "glitch";
    const lane = Math.floor(Math.random() * 4);
    state.entities.push({ type, lane, y: -34, hit: false, phase: Math.random() * Math.PI * 2 });
    state.spawnIndex += 1;
  }

  function triggerFlash() {
    flash.classList.remove("active");
    void flash.offsetWidth;
    flash.classList.add("active");
  }

  function roundedRect(ctx, x, y, rectWidth, rectHeight, radius) {
    const r = Math.min(radius, rectWidth / 2, rectHeight / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + rectWidth, y, x + rectWidth, y + rectHeight, r);
    ctx.arcTo(x + rectWidth, y + rectHeight, x, y + rectHeight, r);
    ctx.arcTo(x, y + rectHeight, x, y, r);
    ctx.arcTo(x, y, x + rectWidth, y, r);
    ctx.closePath();
  }

  function drawBackground() {
    const background = context.createLinearGradient(0, 0, 0, height);
    background.addColorStop(0, "#080d1c");
    background.addColorStop(1, "#040713");
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);

    context.fillStyle = "rgba(93, 105, 150, 0.08)";
    for (let index = 0; index < 14; index += 1) {
      const buildingWidth = 24 + (index % 4) * 9;
      const buildingX = index % 2 === 0 ? index * 18 + 3 : width - index * 17 - buildingWidth;
      const rawY = index * 51 - (state.frameDistance * 0.12) % 51;
      const buildingY = ((rawY % (height + 80)) + height + 80) % (height + 80) - 60;
      context.fillRect(buildingX, buildingY, buildingWidth, 22 + (index % 3) * 8);
      context.fillStyle = index % 2 ? "rgba(56,189,248,.12)" : "rgba(139,92,246,.1)";
      context.fillRect(buildingX + 5, buildingY + 7, 3, 3);
      context.fillStyle = "rgba(93, 105, 150, 0.08)";
    }
  }

  function drawRoad() {
    const road = roadBounds();
    const roadWidth = road.right - road.left;

    context.fillStyle = "rgba(2, 5, 12, 0.82)";
    context.fillRect(road.left - 7, 0, 7, height);
    context.fillRect(road.right, 0, 7, height);

    const roadGradient = context.createLinearGradient(road.left, 0, road.right, 0);
    roadGradient.addColorStop(0, "rgba(13, 19, 36, .96)");
    roadGradient.addColorStop(0.5, "rgba(9, 14, 29, .92)");
    roadGradient.addColorStop(1, "rgba(13, 19, 36, .96)");
    context.fillStyle = roadGradient;
    context.fillRect(road.left, 0, roadWidth, height);

    context.strokeStyle = "rgba(110, 231, 183, .5)";
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(road.left, 0);
    context.lineTo(road.left, height);
    context.moveTo(road.right, 0);
    context.lineTo(road.right, height);
    context.stroke();

    context.strokeStyle = "rgba(148, 163, 184, .18)";
    context.lineWidth = 1;
    context.setLineDash([18, 24]);
    context.lineDashOffset = -(state.frameDistance % 42);
    for (let lane = 1; lane < 4; lane += 1) {
      const x = road.left + road.laneWidth * lane;
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
    }
    context.setLineDash([]);

    context.strokeStyle = "rgba(56, 189, 248, .42)";
    context.lineWidth = 3;
    context.strokeRect(road.left - 0.5, 0, roadWidth + 1, height);

    const finishY = 68;
    context.fillStyle = "rgba(230, 238, 255, .75)";
    for (let x = road.left + 7; x < road.right - 5; x += 15) {
      context.fillRect(x, finishY, 8, 5);
      context.fillRect(x + 7, finishY + 6, 8, 5);
    }
    context.fillStyle = "rgba(110, 231, 183, .8)";
    context.fillRect(road.left, finishY - 16, roadWidth, 1);
  }

  function drawSignal(entity) {
    const x = laneX(entity.lane);
    const pulse = 1 + Math.sin(state.elapsed * 6 + entity.phase) * 0.12;
    context.save();
    context.translate(x, entity.y);
    context.rotate(Math.PI / 4);
    context.shadowColor = "rgba(34, 211, 238, .9)";
    context.shadowBlur = 18;
    context.fillStyle = "rgba(34, 211, 238, .2)";
    context.fillRect(-14 * pulse, -14 * pulse, 28 * pulse, 28 * pulse);
    context.shadowBlur = 0;
    context.fillStyle = "#67e8f9";
    context.fillRect(-8, -8, 16, 16);
    context.fillStyle = "#cffafe";
    context.fillRect(-3, -3, 6, 6);
    context.restore();
  }

  function drawGlitch(entity) {
    const x = laneX(entity.lane);
    context.save();
    context.translate(x, entity.y);
    context.shadowColor = "rgba(251, 113, 133, .72)";
    context.shadowBlur = 16;
    context.fillStyle = "rgba(251, 113, 133, .14)";
    context.fillRect(-15, -15, 30, 30);
    context.shadowBlur = 0;
    context.strokeStyle = "#fb7185";
    context.lineWidth = 2;
    context.setLineDash([5, 3]);
    context.strokeRect(-11, -11, 22, 22);
    context.setLineDash([]);
    context.beginPath();
    context.moveTo(-6, -6);
    context.lineTo(6, 6);
    context.moveTo(6, -6);
    context.lineTo(-6, 6);
    context.stroke();
    context.restore();
  }

  function drawCar() {
    const y = height - 66;
    const carWidth = Math.min(42, roadBounds().laneWidth * 0.58);
    const carHeight = 62;
    const x = state.playerX - carWidth / 2;

    context.save();
    context.shadowColor = "rgba(56, 189, 248, .7)";
    context.shadowBlur = 20;
    context.fillStyle = "rgba(56, 189, 248, .1)";
    roundedRect(context, x - 4, y - 4, carWidth + 8, carHeight + 8, 12);
    context.fill();
    context.shadowBlur = 0;

    const bodyGradient = context.createLinearGradient(x, y, x + carWidth, y);
    bodyGradient.addColorStop(0, "#6366f1");
    bodyGradient.addColorStop(0.5, "#38bdf8");
    bodyGradient.addColorStop(1, "#8b5cf6");
    context.fillStyle = bodyGradient;
    roundedRect(context, x, y + 12, carWidth, carHeight - 12, 9);
    context.fill();

    context.fillStyle = "#0b1223";
    roundedRect(context, x + 7, y + 20, carWidth - 14, 17, 5);
    context.fill();
    context.fillStyle = "rgba(165, 243, 252, .5)";
    roundedRect(context, x + 10, y + 23, carWidth - 20, 10, 3);
    context.fill();

    context.fillStyle = "#060913";
    context.fillRect(x - 4, y + 28, 5, 15);
    context.fillRect(x + carWidth - 1, y + 28, 5, 15);
    context.fillRect(x - 3, y + 49, 5, 13);
    context.fillRect(x + carWidth - 2, y + 49, 5, 13);

    context.fillStyle = "#cffafe";
    context.fillRect(x + 4, y + 19, 4, 4);
    context.fillRect(x + carWidth - 8, y + 19, 4, 4);
    context.fillStyle = "#fb7185";
    context.fillRect(x + 4, y + carHeight - 9, 4, 3);
    context.fillRect(x + carWidth - 8, y + carHeight - 9, 4, 3);
    context.restore();
  }

  function drawPauseState() {
    context.fillStyle = "rgba(4, 7, 15, .62)";
    context.fillRect(0, 0, width, height);
    context.textAlign = "center";
    context.fillStyle = "#f7f8ff";
    context.font = "600 24px Sora, sans-serif";
    context.fillText("PAUSED", width / 2, height / 2 - 4);
    context.fillStyle = "#929ab3";
    context.font = "500 11px Space Grotesk, sans-serif";
    context.fillText("Press the pause button or Space to continue", width / 2, height / 2 + 20);
  }

  function draw() {
    context.save();
    if (state.shake > 0) {
      context.translate((Math.random() - 0.5) * state.shake * 16, (Math.random() - 0.5) * state.shake * 10);
    }
    drawBackground();
    drawRoad();
    state.entities.forEach((entity) => {
      if (entity.type === "signal") drawSignal(entity);
      else drawGlitch(entity);
    });
    if (state.mode !== "idle") drawCar();
    context.restore();

    if (state.mode === "paused") drawPauseState();
  }

  function update(delta) {
    if (state.mode !== "running") return;

    state.elapsed += delta;
    state.progress = Math.min(1, state.progress + delta / 22);
    const currentSpeed = 235 + state.progress * 48 + state.signals * 5;
    state.frameDistance += currentSpeed * delta;
    state.shake = Math.max(0, state.shake - delta);

    state.playerX += (laneX(state.lane) - state.playerX) * Math.min(1, delta * 11);
    state.spawnTimer -= delta;
    if (state.spawnTimer <= 0) {
      spawnEntity();
      state.spawnTimer = 0.72 - state.progress * 0.15;
    }

    const playerY = height - 66;
    const collisionX = roadBounds().laneWidth * 0.34;
    state.entities = state.entities.filter((entity) => {
      if (entity.hit) return entity.y < height + 60;
      entity.y += currentSpeed * delta;

      if (Math.abs(entity.y - playerY) < 31 && Math.abs(laneX(entity.lane) - state.playerX) < collisionX) {
        entity.hit = true;
        if (entity.type === "signal") {
          state.signals = Math.min(3, state.signals + 1);
          gameStatus.textContent = `Energy signal collected. ${state.signals} of 3 found.`;
          if (state.signals === 3) showToast("All three project signals collected!");
        } else {
          state.integrity = Math.max(0, state.integrity - 25);
          state.shake = 0.6;
          triggerFlash();
          gameStatus.textContent = `Glitch hit. Integrity ${state.integrity} percent.`;
        }
      }
      return entity.y < height + 60;
    });

    updateHud();

    if (state.integrity <= 0) {
      finishGame(false);
      return;
    }

    if (state.progress >= 1) finishGame(true);
  }

  function loop(timestamp) {
    const delta = Math.max(0, Math.min((timestamp - lastTime) / 1000, 0.04));
    lastTime = timestamp;
    update(delta);
    draw();
    animationFrame = requestAnimationFrame(loop);
  }

  startButton?.addEventListener("click", startGame);
  pauseButton?.addEventListener("click", pauseGame);
  restartButton?.addEventListener("click", startGame);
  leftButton?.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    moveLane(-1);
  });
  rightButton?.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    moveLane(1);
  });

  skipButton?.addEventListener("click", () => {
    state.progress = 1;
    state.signals = 3;
    state.integrity = 100;
    updateHud();
    finishGame(true);
  });

  viewButton?.addEventListener("click", () => {
    projectGrid?.scrollIntoView({ behavior: reduceMotionQuery.matches ? "auto" : "smooth", block: "start" });
    projectGrid?.classList.add("quest-pulse");
    window.setTimeout(() => projectGrid?.classList.remove("quest-pulse"), 1400);
  });

  canvas.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch") touchStartX = event.clientX;
  });

  canvas.addEventListener("pointerup", (event) => {
    if (event.pointerType !== "touch" || touchStartX === null) return;
    const distance = event.clientX - touchStartX;
    if (Math.abs(distance) > 25) moveLane(distance > 0 ? 1 : -1);
    touchStartX = null;
  });

  window.addEventListener("keydown", (event) => {
    const bounds = quest.getBoundingClientRect();
    const inView = bounds.top < window.innerHeight && bounds.bottom > 0;
    if (!inView || !["running", "paused"].includes(state.mode)) return;
    if (["INPUT", "TEXTAREA", "BUTTON"].includes(document.activeElement?.tagName)) return;

    if (["ArrowLeft", "KeyA"].includes(event.code)) {
      event.preventDefault();
      moveLane(-1);
    } else if (["ArrowRight", "KeyD"].includes(event.code)) {
      event.preventDefault();
      moveLane(1);
    } else if (event.code === "Space") {
      event.preventDefault();
      pauseGame();
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && state.mode === "running") pauseGame();
  });

  if (hasCompletedBefore) {
    markQuestComplete();
  }

  resetGame();
  draw();
  animationFrame = requestAnimationFrame(loop);
  window.addEventListener("pagehide", () => cancelAnimationFrame(animationFrame), { once: true });
}

initProjectQuest();
