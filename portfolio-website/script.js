const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const revealItems = document.querySelectorAll(".reveal");
const introScreen = document.querySelector("[data-intro-screen]");
const yearTarget = document.querySelector("[data-year]");
const copyButton = document.querySelector("[data-copy-email]");
const copyStatus = document.querySelector("[data-copy-status]");
const email = "ibadsiddiqui505@gmail.com";
const introStartedAt = performance.now();
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const phoneIntro = window.matchMedia("(max-width: 620px)").matches;
const introMinDuration = reduceMotion ? 0 : phoneIntro ? 6400 : 5900;
const introExitDuration = reduceMotion ? 0 : 1050;
let introDone = false;

function syncHeader() {
  if (header) {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
}

function closeNav() {
  if (nav) {
    nav.classList.remove("is-open");
  }
  if (navToggle) {
    navToggle.setAttribute("aria-expanded", "false");
  }
}

function finishIntro() {
  if (introDone) {
    return;
  }

  introDone = true;

  if (!introScreen) {
    document.body.classList.remove("intro-active");
    document.body.classList.add("intro-complete");
    return;
  }

  const elapsed = performance.now() - introStartedAt;
  const remaining = Math.max(introMinDuration - elapsed, 0);

  window.setTimeout(() => {
    introScreen.classList.add("is-finished");
    introScreen.setAttribute("aria-hidden", "true");

    window.setTimeout(() => {
      document.body.classList.remove("intro-active");
      document.body.classList.add("intro-complete");
      introScreen.remove();
    }, introExitDuration);
  }, remaining);
}

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", closeNav);
});

// Smooth scroll to target sections without appending hash to the URL
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href").substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth"
      });
    }
  });
});

const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function syncActiveNav() {
  let current = null;
  const isBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 50);

  if (isBottom && sections.length > 0) {
    current = sections[sections.length - 1];
  } else {
    for (const section of sections) {
      if (section.offsetTop <= window.scrollY + 140) {
        current = section;
      }
    }
  }

  navLinks.forEach((link) => {
    const isActive = current && link.getAttribute("href") === `#${current.id}`;
    link.classList.toggle("is-active", Boolean(isActive));
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

revealItems.forEach((item) => observer.observe(item));

if (copyButton) {
  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(email);
      if (copyStatus) copyStatus.textContent = "Email copied.";
    } catch (error) {
      if (copyStatus) copyStatus.textContent = email;
    }
  });
}

if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

syncHeader();
syncActiveNav();
window.addEventListener("scroll", () => {
  syncHeader();
  syncActiveNav();
}, { passive: true });

if (document.readyState === "complete") {
  finishIntro();
} else {
  window.addEventListener("load", finishIntro);
}

