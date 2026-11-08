// GenSolutions — lightweight motion system (vanilla JavaScript)
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const body = document.body;
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  // Keep the mobile navigation keyboard and screen-reader friendly.
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Current year in every footer.
  document.querySelectorAll("#year").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  // Reading progress indicator.
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  body.prepend(progress);

  const updateScrollUI = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    progress.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
    document.querySelector(".site-header")?.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  window.addEventListener("scroll", updateScrollUI, { passive: true });
  updateScrollUI();

  if (!reduceMotion) {
    body.classList.add("motion-enabled");

    // Soft cursor ambience on desktop; no custom cursor or interaction hijack.
    if (window.matchMedia("(pointer: fine)").matches) {
      const aura = document.createElement("div");
      aura.className = "pointer-aura";
      aura.setAttribute("aria-hidden", "true");
      body.append(aura);
      window.addEventListener("pointermove", (event) => {
        aura.style.setProperty("--pointer-x", `${event.clientX}px`);
        aura.style.setProperty("--pointer-y", `${event.clientY}px`);
      }, { passive: true });

      // A subtle pointer response in the hero artwork.
      const art = document.querySelector(".hero-art");
      if (art) {
        art.addEventListener("pointermove", (event) => {
          const bounds = art.getBoundingClientRect();
          const x = (event.clientX - bounds.left) / bounds.width - 0.5;
          const y = (event.clientY - bounds.top) / bounds.height - 0.5;
          art.style.setProperty("--art-x", String(x));
          art.style.setProperty("--art-y", String(y));
        });
        art.addEventListener("pointerleave", () => {
          art.style.setProperty("--art-x", "0");
          art.style.setProperty("--art-y", "0");
        });
      }

      // Very restrained card tilt, only on larger screens.
      if (window.matchMedia("(min-width: 900px)").matches) {
        document.querySelectorAll(".capability-card, .team-card").forEach((card) => {
          card.addEventListener("pointermove", (event) => {
            const rect = card.getBoundingClientRect();
            const px = (event.clientX - rect.left) / rect.width;
            const py = (event.clientY - rect.top) / rect.height;
            card.style.setProperty("--tilt-x", `${(0.5 - py) * 3}deg`);
            card.style.setProperty("--tilt-y", `${(px - 0.5) * 3}deg`);
            card.style.setProperty("--spot-x", `${px * 100}%`);
            card.style.setProperty("--spot-y", `${py * 100}%`);
          });
          card.addEventListener("pointerleave", () => {
            card.style.setProperty("--tilt-x", "0deg");
            card.style.setProperty("--tilt-y", "0deg");
            card.style.setProperty("--spot-x", "50%");
            card.style.setProperty("--spot-y", "50%");
          });
        });
      }
    }

    // Staggered, one-time reveal as sections enter the viewport.
    const revealTargets = document.querySelectorAll(
      ".intro-content h2, .intro-bottom, .section-heading, .capability-card, " +
      ".project-row, .manifesto-inner > p, .manifesto-bottom, " +
      ".people-strip > div, .contact-band-inner, .dna-statement, " +
      ".dna-grid article, .content-grid, .team-card, .project-detail > *, .contact-layout > *"
    );

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries, activeObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          activeObserver.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

      revealTargets.forEach((element, index) => {
        element.classList.add("reveal");
        const siblings = Array.from(element.parentElement?.children || []);
        const siblingIndex = siblings.indexOf(element);
        element.style.setProperty("--reveal-delay", `${Math.min(siblingIndex, 5) * 75}ms`);
        observer.observe(element);
      });
    }

    // Tiny magnetic response for primary calls-to-action.
    if (window.matchMedia("(pointer: fine) and (min-width: 900px)").matches) {
      document.querySelectorAll(".button-primary, .big-arrow").forEach((button) => {
        button.addEventListener("pointermove", (event) => {
          const rect = button.getBoundingClientRect();
          const dx = event.clientX - (rect.left + rect.width / 2);
          const dy = event.clientY - (rect.top + rect.height / 2);
          button.style.transform = `translate(${dx * 0.045}px, ${dy * 0.045}px)`;
        });
        button.addEventListener("pointerleave", () => {
          button.style.transform = "";
        });
      });
    }
  }

  // The contact form prepares an email; this static site does not store submissions.
  const form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const subject = encodeURIComponent(`GenSolutions enquiry — ${data.get("name")}`);
      const message = encodeURIComponent(
        `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nOrganisation: ${data.get("organisation")}\nInterest: ${data.get("interest")}\n\n${data.get("message")}`
      );
      const success = form.querySelector(".form-success");
      if (success) success.style.display = "block";
      window.location.href = `mailto:hello.gensolutions@gmail.com?subject=${subject}&body=${message}`;
    });
  }
})();
