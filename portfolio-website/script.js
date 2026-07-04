const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const revealItems = document.querySelectorAll(".reveal");
const yearTarget = document.querySelector("[data-year]");
const copyButton = document.querySelector("[data-copy-email]");
const copyStatus = document.querySelector("[data-copy-status]");
const email = "ibadsiddiqui505@gmail.com";

function syncHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

function closeNav() {
  nav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
}

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

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

  for (const section of sections) {
    if (section.offsetTop <= window.scrollY + 140) {
      current = section;
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

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(email);
    copyStatus.textContent = "Email copied.";
  } catch (error) {
    copyStatus.textContent = email;
  }
});

yearTarget.textContent = new Date().getFullYear();
syncHeader();
syncActiveNav();
window.addEventListener("scroll", () => {
  syncHeader();
  syncActiveNav();
}, { passive: true });
