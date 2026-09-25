const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
const navigationLinks = document.querySelectorAll(".nav-link");
const revealItems = document.querySelectorAll(".reveal");
const progressBar = document.querySelector(".scroll-progress span");
const cursorGlow = document.querySelector(".cursor-glow");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function setMenu(open) {
  if (!menuToggle || !navigation) return;

  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  navigation.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);
}

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  setMenu(!isOpen);
});

navigationLinks.forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 850) setMenu(false);
});

function updateOnScroll() {
  const scrollTop = window.scrollY;
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? scrollTop / scrollableHeight : 0;

  header?.classList.toggle("scrolled", scrollTop > 30);
  if (progressBar) progressBar.style.transform = `scaleX(${Math.min(progress, 1)})`;
}

window.addEventListener("scroll", updateOnScroll, { passive: true });
updateOnScroll();

if ("IntersectionObserver" in window && !reduceMotion.matches) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("revealed"));
}

if ("IntersectionObserver" in window) {
  const sections = document.querySelectorAll("main section[id]");
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navigationLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { threshold: 0, rootMargin: "-45% 0px -45% 0px" }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

if (!reduceMotion.matches && window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("pointermove", (event) => {
    document.documentElement.style.setProperty("--mouse-x", `${event.clientX}px`);
    document.documentElement.style.setProperty("--mouse-y", `${event.clientY}px`);
  });

  const tiltStage = document.querySelector("[data-tilt]");
  const tiltCard = tiltStage?.querySelector(".visual-card");

  tiltStage?.addEventListener("pointermove", (event) => {
    if (!tiltCard) return;
    const bounds = tiltStage.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
    tiltCard.style.transform = `rotateY(${horizontal * 8}deg) rotateX(${vertical * -8}deg)`;
  });

  tiltStage?.addEventListener("pointerleave", () => {
    if (tiltCard) tiltCard.style.transform = "";
  });

  if (cursorGlow) cursorGlow.style.opacity = "1";
}

document.querySelector("[data-year]").textContent = new Date().getFullYear();

const toast = document.querySelector(".toast");
document.querySelector(".contact-button")?.addEventListener("click", () => {
  toast?.classList.add("show");
  window.setTimeout(() => toast?.classList.remove("show"), 2200);
});
