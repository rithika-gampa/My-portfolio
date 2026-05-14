const navLinks = document.querySelectorAll(".site-nav a");
const sections = document.querySelectorAll("main section[id]");
const revealItems = document.querySelectorAll(".reveal");
const contactForm = document.querySelector("#contact-form");
const formNote = document.querySelector("#form-note");
const loader = document.querySelector("#loader");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

revealItems.forEach((item, index) => {
  const staggerSlot = index % 4;
  item.style.setProperty("--reveal-delay", `${staggerSlot * 0.08}s`);
});

const finishLoading = () => {
  document.body.classList.add("is-loaded");
  document.body.classList.remove("is-loading");

  if (!loader) {
    return;
  }

  window.setTimeout(() => {
    loader.remove();
  }, 700);
};

if (document.readyState === "complete") {
  window.setTimeout(finishLoading, reduceMotion ? 0 : 950);
} else {
  window.addEventListener(
    "load",
    () => {
      window.setTimeout(finishLoading, reduceMotion ? 0 : 950);
    },
    { once: true }
  );
}

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const activeLink = document.querySelector(
        `.site-nav a[href="#${entry.target.id}"]`
      );

      navLinks.forEach((link) => link.classList.remove("is-active"));

      if (activeLink) {
        activeLink.classList.add("is-active");
      }
    });
  },
  {
    rootMargin: "-35% 0px -45% 0px",
    threshold: 0.2,
  }
);

sections.forEach((section) => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-visible", entry.isIntersecting);
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -8% 0px",
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

if (contactForm && formNote) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    formNote.textContent = "Opening your mail app...";
    window.location.href = `mailto:hello@example.com?subject=${subject}&body=${body}`;
    contactForm.reset();
  });
}
