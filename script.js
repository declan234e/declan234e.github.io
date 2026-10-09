/* ============================================================
   declan234e.dev — interactions
   hero boot sequence · scroll reveal · konami cheat code
   ============================================================ */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Hero boot sequence (typewriter) ---------- */
const BOOT_LINES = [
  { text: "whoami", prompt: true },
  { text: "declan b — minecraft modder · rdr2 tinkerer · enjoyer of programming", output: true },
  { text: "ls ~/projects", prompt: true },
  { text: "horsemenu/   oblivion/   cruzire/   batbot/   ████████/", output: true },
];

const bootEl = document.getElementById("boot");
const nameEl = document.getElementById("hero-name");

function makeLine(line) {
  const span = document.createElement("span");
  span.className = "boot-line" + (line.output ? " output" : "");
  if (line.prompt) {
    const p = document.createElement("span");
    p.className = "cmd-prompt";
    p.textContent = "$ ";
    span.appendChild(p);
  }
  return span;
}

async function typeText(el, text, speed) {
  for (const ch of text) {
    el.appendChild(document.createTextNode(ch));
    await new Promise((r) => setTimeout(r, speed + Math.random() * 40));
  }
}

(async () => {
  if (!bootEl) return;

  // Big name stays hidden until the boot sequence finishes.
  if (nameEl) {
    nameEl.style.opacity = "0";
    nameEl.style.transition = "opacity 0.9s ease";
  }

  const cursor = document.createElement("span");
  cursor.className = "cursor";
  cursor.setAttribute("aria-hidden", "true");

  for (const line of BOOT_LINES) {
    const span = makeLine(line);
    bootEl.appendChild(span);
    bootEl.appendChild(cursor);
    if (prefersReducedMotion) {
      span.appendChild(document.createTextNode(line.text));
    } else {
      await typeText(span, line.text, line.prompt ? 55 : 14);
      await new Promise((r) => setTimeout(r, 260));
    }
  }

  cursor.remove();
  if (nameEl) requestAnimationFrame(() => (nameEl.style.opacity = "1"));
})();

/* ---------- Scroll reveal ---------- */
const revealEls = document.querySelectorAll(".reveal");
if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealEls.forEach((el) => el.classList.add("visible"));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => io.observe(el));
}

/* ---------- Konami cheat code easter egg ---------- */
const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "KeyB", "KeyA",
];
let konamiIdx = 0;
let toastTimer;

document.addEventListener("keydown", (e) => {
  if (e.code === KONAMI[konamiIdx]) {
    konamiIdx++;
    if (konamiIdx === KONAMI.length) {
      konamiIdx = 0;
      showToast();
    }
  } else {
    konamiIdx = e.code === KONAMI[0] ? 1 : 0;
  }
});

function showToast() {
  const t = document.getElementById("konami-toast");
  if (!t) return;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 3500);
}
