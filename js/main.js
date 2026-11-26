(() => {
  "use strict";
  const body = document.body;
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  const header = document.querySelector(".site-header");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Accessible mobile menu. Anchor navigation always closes the panel.
  if (menuButton && nav) {
    const closeMenu = () => {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
      body.classList.remove("menu-open");
    };
    menuButton.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      body.classList.toggle("menu-open", open);
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
    window.addEventListener("resize", () => {
      if (window.innerWidth > 820) closeMenu();
    }, {passive:true});
  }

  // Hide unavailable remote photos cleanly; the tile backgrounds remain as fallbacks.
  document.querySelectorAll(".story-tile img, .team-photo-new img").forEach(image => {
    image.addEventListener("error", () => { image.hidden = true; }, {once:true});
  });

  // Shared dynamic year.
  document.querySelectorAll("[data-year]").forEach(node => {
    node.textContent = String(new Date().getFullYear());
  });

  // Skip-to-content link for keyboard users; expose the main landmark as a target.
  const mainEl = document.querySelector("main");
  if (mainEl) {
    if (!mainEl.id) mainEl.id = "main";
    mainEl.setAttribute("tabindex", "-1");
    const skip = document.createElement("a");
    skip.className = "skip-link";
    skip.href = "#main";
    skip.textContent = "Skip to content";
    body.insertBefore(skip, body.firstChild);
  }

  // Reflect active navigation state to assistive technology.
  const markCurrent = link => {
    const active = link.classList.contains("active");
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  };
  nav && nav.querySelectorAll("a").forEach(markCurrent);

  // Header depth and lightweight reading progress.
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  body.prepend(progress);
  const updateScroll = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
    progress.style.transform = "scaleX(" + ratio + ")";
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  window.addEventListener("scroll", updateScroll, {passive:true});
  updateScroll();

  // Reveal content only when it enters the viewport; reduced-motion stays static.
  if (!reduceMotion && "IntersectionObserver" in window) {
    body.classList.add("js-reveal");
    const targets = document.querySelectorAll(
      "[data-reveal], .cap-card, .work-row, .founder-card, .content-row, " +
      ".principles-grid article, .capability-detail, .approach-steps article, " +
      ".career-opening, .project-detail-main section, .chaos-points article, " +
      ".pin-card, .feature-card, .project-card-new, .team-member-new"
    );
    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        activeObserver.unobserve(entry.target);
      });
    }, {threshold:0.12,rootMargin:"0px 0px -28px 0px"});
    targets.forEach((node, index) => {
      node.style.setProperty("--reveal-delay", (Math.min(index % 4, 3) * 65) + "ms");
      node.classList.add("reveal");
      observer.observe(node);
    });
  }

  // Keep the one-page nav in sync with the visible section.
  if ("IntersectionObserver" in window && nav && body.dataset.page === "home") {
    const sections = Array.from(nav.querySelectorAll('a[href^="#"]'))
      .map(link => ({link, section: document.querySelector(link.getAttribute("href"))}))
      .filter(item => item.section);
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        sections.forEach(item => {
          const active = item.section === entry.target;
          if (active) item.link.classList.add("active");
          else item.link.classList.remove("active");
          markCurrent(item.link);
        });
      });
    }, {rootMargin:"-30% 0px -58% 0px",threshold:0});
    sections.forEach(item => sectionObserver.observe(item.section));
  }

  // Gentle pointer depth in the hero. No custom cursor or blocked interactions.
  if (!reduceMotion && window.matchMedia("(pointer:fine)").matches) {
    const stage = document.querySelector(".hero-stage");
    if (stage) {
      const core = stage.querySelector(".hero-stage-core");
      stage.addEventListener("pointermove", event => {
        const rect = stage.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        stage.style.setProperty("--pointer-x", (x * 8) + "px");
        stage.style.setProperty("--pointer-y", (y * 8) + "px");
        if (core) core.style.transform = "translate(" + (x * -7) + "px," + (y * -7) + "px)";
      }, {passive:true});
      stage.addEventListener("pointerleave", () => {
        stage.style.setProperty("--pointer-x","0px");
        stage.style.setProperty("--pointer-y","0px");
        if (core) core.style.transform = "";
      });
    }
  }

  // Email-based contact form is intentionally static: no unconfigured endpoint.
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", event => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;
      const data = new FormData(contactForm);
      const subject = encodeURIComponent("DAVAN Technologies enquiry — " + data.get("name"));
      const message = encodeURIComponent(
        "Name: " + data.get("name") + "\n" +
        "Email: " + data.get("email") + "\n" +
        "Organisation: " + (data.get("organisation") || "Not specified") + "\n" +
        "Interest: " + data.get("interest") + "\n\n" +
        data.get("message")
      );
      const success = contactForm.querySelector(".form-success");
      if (success) success.hidden = false;
      window.location.href = "mailto:hello.gensolutions@gmail.com?subject=" + subject + "&body=" + message;
    });
  }
})();