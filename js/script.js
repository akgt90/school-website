// ═══════════════════════════════════════════════════════════
// PRASHANTI PUBLIC SCHOOL — Immersive Interactions v2
// ═══════════════════════════════════════════════════════════

(function () {
  "use strict";

  // ── 1. PARTICLE SYSTEM ─────────────────────────────────
  const canvas = document.getElementById("particles");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    let mouse = { x: -999, y: -999 };

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.8 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse repulsion
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          this.x += (dx / dist) * force * 2;
          this.y += (dy / dist) * force * 2;
        }

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.reset();
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(160, 100, 10, ${this.opacity * 0.5})`;
        ctx.fill();
      }
    }

    // Init particles
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
    for (let i = 0; i < count; i++) particles.push(new Particle());

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(140, 90, 10, ${0.03 * (1 - dist / 140)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      drawConnections();
      requestAnimationFrame(animateParticles);
    }
    animateParticles();

    document.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
  }

  // ── 2. CUSTOM CURSOR ───────────────────────────────────
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");

  if (dot && ring && window.innerWidth > 760) {
    let cursorX = 0, cursorY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener("mousemove", (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      dot.style.transform = `translate(${cursorX - 4}px, ${cursorY - 4}px)`;
    });

    function followRing() {
      ringX += (cursorX - ringX) * 0.12;
      ringY += (cursorY - ringY) * 0.12;
      ring.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;
      requestAnimationFrame(followRing);
    }
    followRing();

    // Expand on interactive elements
    document.querySelectorAll("a, button, input, textarea, .notice-card, .stat-card, .value-card, .event-card, .timeline-card, .content-card, .contact-card").forEach(el => {
      el.addEventListener("mouseenter", () => ring.classList.add("expand"));
      el.addEventListener("mouseleave", () => ring.classList.remove("expand"));
    });
  }

  // ── 3. HEADER SCROLL EFFECT ────────────────────────────
  const header = document.getElementById("site-header");
  if (header) {
    const onScroll = () => {
      header.classList.toggle("scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }



  // ── 4. MOBILE NAV (morphing hamburger) ─────────────────
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("is-open");
      navToggle.classList.toggle("is-active", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    // Close on link click (mobile)
    siteNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        siteNav.classList.remove("is-open");
        navToggle.classList.remove("is-active");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  // ── 5. ACTIVE NAV LINK ─────────────────────────────────
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".site-nav a").forEach(link => {
    if (link.getAttribute("href") === currentPage) link.classList.add("active");
  });

  // ── 6. FOOTER YEAR ─────────────────────────────────────
  document.querySelectorAll("#current-year").forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // ── 7. TYPING EFFECT ──────────────────────────────────
  const typedTarget = document.getElementById("typed-target");
  if (typedTarget) {
    const pageName = currentPage.replace(".html", "");
    let words;
    switch (pageName) {
      case "about":
        words = ["bright future.", "better tomorrow.", "stronger community."];
        break;
      case "events":
        words = ["important dates.", "upcoming events.", "school programs."];
        break;
      case "contact":
        words = ["hear from you.", "help you out.", "connect with you."];
        break;
      default:
        words = ["future leaders.", "young dreamers.", "bright minds.", "next generation."];
    }

    let wordIndex = 0, charIndex = 0, isDeleting = false;

    function typeLoop() {
      const current = words[wordIndex];
      typedTarget.textContent = current.substring(0, charIndex);

      if (!isDeleting) {
        charIndex++;
        if (charIndex > current.length) {
          isDeleting = true;
          setTimeout(typeLoop, 2000);
          return;
        }
      } else {
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }
      }

      const speed = isDeleting ? 40 : 80;
      setTimeout(typeLoop, speed);
    }
    setTimeout(typeLoop, 800);
  }

  // ── 8. SCROLL REVEAL ───────────────────────────────────
  const revealElements = document.querySelectorAll(".reveal");
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
    );
    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ── 9. TIMELINE REVEAL (events page) ──────────────────
  const timelineItems = document.querySelectorAll(".timeline-item");
  if (timelineItems.length > 0) {
    const tlObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            tlObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    timelineItems.forEach((item, i) => {
      item.style.transitionDelay = `${i * 0.12}s`;
      tlObserver.observe(item);
    });
  }

  // ── 10. ANIMATED COUNTERS ──────────────────────────────
  const counters = document.querySelectorAll(".stat-number[data-target]");
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.target, 10);
            const suffix = el.dataset.suffix || "";
            const duration = 2000;
            const start = performance.now();

            function tick(now) {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              // Ease out cubic
              const eased = 1 - Math.pow(1 - progress, 3);
              el.textContent = Math.floor(eased * target) + suffix;
              if (progress < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(c => counterObserver.observe(c));
  }

  // ── 11. 3D TILT ON HERO CARD ──────────────────────────
  const tiltCard = document.getElementById("hero-tilt");
  if (tiltCard && window.innerWidth > 760) {
    tiltCard.addEventListener("mousemove", (e) => {
      const rect = tiltCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const midX = rect.width / 2;
      const midY = rect.height / 2;
      const rotateY = ((x - midX) / midX) * 6;
      const rotateX = ((midY - y) / midY) * 6;
      tiltCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    tiltCard.addEventListener("mouseleave", () => {
      tiltCard.style.transform = "rotateX(0) rotateY(0)";
    });
  }

  // ── 12. CONTACT FORM ──────────────────────────────────
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  if (form && status) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      status.textContent = "✓ Thank you! Your message has been received.";
      form.reset();
    });
  }

})();
