const navLinks = document.querySelectorAll(".site-nav a");
const sections = document.querySelectorAll("main section[id]");
const revealItems = document.querySelectorAll(".reveal");
const contactForm = document.querySelector("#contact-form");
const formNote = document.querySelector("#form-note");
const contactMailLink = document.querySelector("#contact-mail-link");
const loader = document.querySelector("#loader");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const shouldUseMailApp =
  window.matchMedia("(pointer: coarse)").matches ||
  /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
const canUseCursorFx =
  window.matchMedia("(pointer: fine)").matches && !reduceMotion;

if (canUseCursorFx) {
  const cursorCore = document.createElement("span");
  const cursorOutline = document.createElement("span");

  cursorCore.className = "cursor-core";
  cursorOutline.className = "cursor-outline";

  document.body.append(cursorOutline, cursorCore);
  document.body.classList.add("has-cursor-fx");

  const pointer = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };

  const followers = [
    {
      element: cursorOutline,
      x: pointer.x,
      y: pointer.y,
      ease: 0.16,
      offsetX: -23,
      offsetY: -23,
    },
    {
      element: cursorCore,
      x: pointer.x,
      y: pointer.y,
      ease: 0.28,
      offsetX: -7,
      offsetY: -7,
    },
  ];

  let idleTimer = 0;
  let pointerSpeed = 0;

  const markPointerActive = () => {
    document.body.classList.remove("is-pointer-idle");
    window.clearTimeout(idleTimer);
    idleTimer = window.setTimeout(() => {
      document.body.classList.add("is-pointer-idle");
    }, 180);
  };

  window.addEventListener("pointermove", (event) => {
    const deltaX = event.clientX - pointer.x;
    const deltaY = event.clientY - pointer.y;
    pointerSpeed = Math.min(Math.hypot(deltaX, deltaY), 24);
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    markPointerActive();
  });

  window.addEventListener("pointerleave", () => {
    document.body.classList.add("is-pointer-idle");
  });

  window.addEventListener("blur", () => {
    document.body.classList.add("is-pointer-idle");
  });

  window.addEventListener("pointerdown", () => {
    document.body.classList.add("cursor-pressed");
  });

  window.addEventListener("pointerup", () => {
    document.body.classList.remove("cursor-pressed");
  });

  window.addEventListener("pointerover", (event) => {
    const interactiveTarget = event.target.closest(
      "a, button, input, textarea, label"
    );

    document.body.classList.remove("cursor-mode-open", "cursor-mode-type");

    if (!interactiveTarget) {
      return;
    }

    if (interactiveTarget.matches("input, textarea")) {
      document.body.classList.add("cursor-mode-type");
      return;
    }

    document.body.classList.add("cursor-mode-open");
  });

  const animateCursor = () => {
    const tilt = pointerSpeed * 0.65;

    followers.forEach((follower, index) => {
      follower.x += (pointer.x - follower.x) * follower.ease;
      follower.y += (pointer.y - follower.y) * follower.ease;

      const rotation =
        index === 0 ? -tilt * 0.45 : index === 1 ? tilt * 0.75 : tilt * 0.24;
      const scale =
        index === 1 ? 1 - Math.min(pointerSpeed / 180, 0.08) : 1;

      follower.element.style.transform = `translate3d(${
        follower.x + follower.offsetX
      }px, ${follower.y + follower.offsetY}px, 0) rotate(${rotation}deg) scale(${scale})`;
    });

    pointerSpeed *= 0.9;

    window.requestAnimationFrame(animateCursor);
  };

  document.body.classList.add("is-pointer-idle");
  animateCursor();
}

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
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        return;
      }

      const isFullyOutsideViewport =
        entry.boundingClientRect.bottom <= 0 ||
        entry.boundingClientRect.top >= window.innerHeight;

      if (isFullyOutsideViewport) {
        entry.target.classList.remove("is-visible");
      }
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -8% 0px",
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

const buildGmailComposeUrl = ({ name = "", message = "" } = {}) => {
  const cleanName = name.trim();
  const cleanMessage = message.trim();
  const subject = cleanName
    ? `Portfolio inquiry from ${cleanName}`
    : "Portfolio inquiry";
  const bodyLines = [];

  bodyLines.push(`Name: ${cleanName}`);
  bodyLines.push("");

  if (cleanMessage) {
    bodyLines.push(cleanMessage);
  }

  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    tf: "1",
    to: "rithikagampawork@gmail.com",
    su: subject,
  });

  if (bodyLines.length > 0) {
    params.set("body", bodyLines.join("\n"));
  }

  return `https://mail.google.com/mail/u/0/?${params.toString()}`;
};

const buildMailtoUrl = ({ name = "", message = "" } = {}) => {
  const cleanName = name.trim();
  const cleanMessage = message.trim();
  const subject = cleanName
    ? `Portfolio inquiry from ${cleanName}`
    : "Portfolio inquiry";
  const bodyLines = [`Name: ${cleanName}`, ""];

  if (cleanMessage) {
    bodyLines.push(cleanMessage);
  }

  const params = new URLSearchParams({
    subject,
    body: bodyLines.join("\n"),
  });

  return `mailto:rithikagampawork@gmail.com?${params.toString()}`;
};

if (contactMailLink) {
  contactMailLink.addEventListener("click", (event) => {
    event.preventDefault();

    const formData = contactForm ? new FormData(contactForm) : null;
    const name = String(formData?.get("name") || "").trim();
    const message = String(formData?.get("message") || "").trim();
    const destinationUrl = shouldUseMailApp
      ? buildMailtoUrl({ name, message })
      : buildGmailComposeUrl({ name, message });

    if (shouldUseMailApp) {
      window.location.href = destinationUrl;
      return;
    }

    window.open(destinationUrl, "_blank", "noopener,noreferrer");
  });
}

if (contactForm && formNote) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const destinationUrl = shouldUseMailApp
      ? buildMailtoUrl({ name, message })
      : buildGmailComposeUrl({ name, message });

    formNote.textContent = shouldUseMailApp
      ? "Opening your mail app..."
      : "Opening Gmail in a new tab...";

    if (shouldUseMailApp) {
      window.location.href = destinationUrl;
    } else {
      window.open(destinationUrl, "_blank", "noopener,noreferrer");
    }

    contactForm.reset();
  });
}
