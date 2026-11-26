(() => {
  "use strict";
  const body = document.body;
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      body.classList.toggle("menu-open", open);
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
      body.classList.remove("menu-open");
    }));
  }

  document.querySelectorAll("[data-year]").forEach(node => node.textContent = String(new Date().getFullYear()));

  const header = document.querySelector(".site-header");
  const updateHeader = () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  window.addEventListener("scroll", updateHeader, {passive:true});
  updateHeader();

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && "IntersectionObserver" in window) {
    const targets = document.querySelectorAll(".cap-card,.work-row,.founder-card,.content-row,.principles-grid article,.capability-detail,.approach-steps article,.career-opening,.project-detail-main section");
    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        activeObserver.unobserve(entry.target);
      });
    }, {threshold:0.12,rootMargin:"0px 0px -24px 0px"});
    targets.forEach((node,index) => {
      node.classList.add("reveal");
      node.style.setProperty("--reveal-delay", Math.min(index % 4, 3) * 65 + "ms");
      observer.observe(node);
    });
  }

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