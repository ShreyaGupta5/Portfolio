const titles = [
  "Full-Stack Developer",
  "React.js Developer",
  "Software Engineer",
  "Hardware & Embedded Systems Learner",
  "ECE Student",
  "Problem Solver"
];

const skills = {
  frontend: [
    ["HTML5", 92],
    ["CSS3", 90],
    ["JavaScript (ES6+)", 86],
    ["React.js", 82],
    ["Responsive Web Design", 90]
  ],
  backend: [
    ["Node.js", 80],
    ["Express.js", 78],
    ["RESTful APIs", 84]
  ],
  database: [
    ["MySQL", 80]
  ],
  cloud: [
    ["AWS Cloud", 72],
    ["Git", 84],
    ["GitHub", 86]
  ],
  programming: [
    ["C", 82],
    ["Python", 86],
    ["Java", 74],
    ["Data Structures & Algorithms", 78]
  ]
};

const projects = [
  {
    title: "Weather Dashboard",
    category: ["web", "api"],
    shot: "Weather API",
    image: "assets/project-weather-dashboard.webp",
    description:
      "Developed a real-time weather dashboard using OpenWeatherMap API to fetch and display live weather information for multiple cities with a scalable full-stack upgrade path.",
    technologies: ["React.js", "JavaScript", "REST API", "Node.js", "AWS"],
    features: ["Live weather updates", "Dynamic city search", "Responsive design", "Real-time API integration"],
    live: "projects/weather-dashboard.html",
    repo: ""
  },
  {
    title: "Browser Based Code Editor",
    category: ["web"],
    shot: "Live Editor",
    image: "assets/project-code-editor.webp",
    description:
      "Created a lightweight code editor that allows users to write and execute HTML, CSS, and JavaScript with live preview functionality and developer-focused tooling.",
    technologies: ["React.js", "JavaScript", "HTML5", "CSS3", "GitHub"],
    features: ["Live preview", "Theme toggle", "Code download", "Real-time execution"],
    live: "projects/code-editor.html",
    repo: ""
  },
  {
    title: "RF Transmission Drone",
    category: ["hardware"],
    shot: "RF Drone",
    image: "assets/project-rf-drone.webp",
    description:
      "Designed and assembled a hardware-based RF-controlled drone using transmitter-receiver modules and a KK 2.1.5 flight controller for wireless control and stable flight.",
    technologies: ["RF Communication", "Transmitter-Receiver Modules", "KK 2.1.5 Flight Controller", "Circuit Debugging", "Hardware Integration"],
    features: ["RF signal transmission and reception", "Flight controller calibration", "Motor and ESC wiring", "Flight stability optimization", "Circuit debugging and testing"],
    live: "",
    repo: ""
  }
];

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const themeToggle = document.querySelector(".theme-toggle");
const titleRotator = document.querySelector("#titleRotator");
const projectsGrid = document.querySelector("#projectsGrid");
const contactForm = document.querySelector("#contactForm");
const formStatus = document.querySelector("#formStatus");
const backToTop = document.querySelector(".back-to-top");
const progressBar = document.querySelector(".scroll-progress");
const canvas = document.querySelector("#particleCanvas");
const ctx = canvas.getContext("2d");

let titleIndex = 0;
let charIndex = 0;
let deleting = false;
let particles = [];

document.addEventListener("DOMContentLoaded", () => {
  window.lucide?.createIcons();
  document.querySelector("#year").textContent = new Date().getFullYear();

  setupPreloader();
  setupNavigation();
  setupTheme();
  setupRevealAnimations();
  setupSkills();
  setupProjects("all");
  setupProjectFilters();
  setupContactForm();
  setupScrollFeatures();
  setupToastActions();
  setupParticles();
  typeTitle();
});

function setupPreloader() {
  window.addEventListener("load", () => {
    setTimeout(() => document.querySelector(".preloader").classList.add("hidden"), 450);
  });
}

function setupNavigation() {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.innerHTML = isOpen ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
    window.lucide?.createIcons();
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.innerHTML = '<i data-lucide="menu"></i>';
      window.lucide?.createIcons();
    });
  });
}

function setupTheme() {
  const savedTheme = localStorage.getItem("portfolio-theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    themeToggle.innerHTML = '<i data-lucide="moon"></i>';
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    const light = document.body.classList.contains("light-mode");
    localStorage.setItem("portfolio-theme", light ? "light" : "dark");
    themeToggle.innerHTML = light ? '<i data-lucide="moon"></i>' : '<i data-lucide="sun"></i>';
    window.lucide?.createIcons();
  });
}

function setupRevealAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          animateSkillBars(entry.target);
          animateCounters(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

function typeTitle() {
  const currentTitle = titles[titleIndex];
  const visibleText = currentTitle.slice(0, charIndex);
  titleRotator.textContent = `${visibleText}|`;

  if (!deleting && charIndex < currentTitle.length) {
    charIndex += 1;
    setTimeout(typeTitle, 70);
    return;
  }

  if (!deleting && charIndex === currentTitle.length) {
    deleting = true;
    setTimeout(typeTitle, 1300);
    return;
  }

  if (deleting && charIndex > 0) {
    charIndex -= 1;
    setTimeout(typeTitle, 35);
    return;
  }

  deleting = false;
  titleIndex = (titleIndex + 1) % titles.length;
  setTimeout(typeTitle, 250);
}

function setupSkills() {
  Object.entries(skills).forEach(([group, items]) => {
    const container = document.querySelector(`[data-skill-group="${group}"]`);
    container.innerHTML = items
      .map(
        ([name, level]) => `
          <div class="skill-item">
            <div class="skill-meta">
              <span>${name}</span>
              <span>${level}%</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill" data-level="${level}"></div>
            </div>
          </div>
        `
      )
      .join("");
  });
}

function animateSkillBars(container) {
  container.querySelectorAll(".progress-fill").forEach((bar) => {
    bar.style.width = `${bar.dataset.level}%`;
  });
}

function animateCounters(container) {
  container.querySelectorAll("[data-counter]").forEach((counter) => {
    const target = Number(counter.dataset.counter);
    const duration = 1200;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      counter.textContent = Math.floor(progress * target);
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent = target;
      }
    }

    requestAnimationFrame(update);
  });
}

function setupProjects(filter) {
  const filteredProjects =
    filter === "all" ? projects : projects.filter((project) => project.category.includes(filter));

  projectsGrid.innerHTML = filteredProjects.map(createProjectCard).join("");
  window.lucide?.createIcons();
}

function createProjectCard(project) {
  return `
    <article class="project-card glass-card reveal visible" data-category="${project.category.join(" ")}">
      <div class="project-shot">
        <img src="${project.image}" alt="${project.title} project preview" loading="lazy" />
        <div class="shot-label">${project.shot}</div>
      </div>
      <div class="project-body">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <ul class="feature-list">
          ${project.features.map((feature) => `<li>${feature}</li>`).join("")}
        </ul>
        <div class="tech-list">
          ${project.technologies.map((tech) => `<span>${tech}</span>`).join("")}
        </div>
        <div class="project-actions">
          ${
            project.live
              ? `<a class="btn btn-primary" href="${project.live}" target="_blank" rel="noopener">
                  <i data-lucide="external-link"></i>
                  Live Demo
                </a>`
              : `<span class="hardware-label">
                  <i data-lucide="cpu"></i>
                  Hardware Project
                </span>`
          }
      </div>
      </div>
    </article>
  `;
}

function setupProjectFilters() {
  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      setupProjects(button.dataset.filter);
    });
  });
}

function setupContactForm() {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors();

    const payload = {
      name: contactForm.elements.name.value.trim(),
      email: contactForm.elements.email.value.trim(),
      message: contactForm.elements.message.value.trim()
    };

    if (!validateContact(payload)) {
      return;
    }

    submitContact(payload);
  });
}

async function submitContact(payload) {
  const submitButton = contactForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  formStatus.textContent = "Sending message...";
  formStatus.className = "form-status";

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Message could not be sent");
    }

    formStatus.textContent = "Message sent successfully.";
    formStatus.className = "form-status success";
    contactForm.reset();
  } catch (error) {
    const subject = encodeURIComponent(`Portfolio contact from ${payload.name}`);
    const body = encodeURIComponent(`Name: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`);
    window.location.href = `mailto:guptashreya5905@gmail.com?subject=${subject}&body=${body}`;
    formStatus.textContent = "API unavailable in static preview. Opening email fallback.";
    formStatus.className = "form-status success";
    contactForm.reset();
  } finally {
    submitButton.disabled = false;
  }
}

function setupToastActions() {
  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-toast]");
    if (!target) {
      return;
    }

    showToast(target.dataset.toast);
  });
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("visible");

  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.classList.remove("visible");
  }, 3200);
}

function validateContact(payload) {
  let isValid = true;

  if (payload.name.length < 2) {
    showError("name", "Please enter your name.");
    isValid = false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    showError("email", "Please enter a valid email address.");
    isValid = false;
  }

  if (payload.message.length < 10) {
    showError("message", "Message must be at least 10 characters.");
    isValid = false;
  }

  return isValid;
}

function showError(fieldName, message) {
  const field = contactForm.elements[fieldName];
  field.closest(".form-row").querySelector(".error-message").textContent = message;
}

function clearErrors() {
  document.querySelectorAll(".error-message").forEach((error) => {
    error.textContent = "";
  });
  formStatus.textContent = "";
  formStatus.className = "form-status";
}

function setupScrollFeatures() {
  window.addEventListener("scroll", () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    progressBar.style.width = `${scrolled}%`;
    backToTop.classList.toggle("visible", window.scrollY > 650);
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function setupParticles() {
  resizeCanvas();
  particles = Array.from({ length: window.innerWidth < 700 ? 36 : 78 }, createParticle);
  animateParticles();
  window.addEventListener("resize", () => {
    resizeCanvas();
    particles = Array.from({ length: window.innerWidth < 700 ? 36 : 78 }, createParticle);
  });
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 + 0.8,
    speedX: (Math.random() - 0.5) * 0.45,
    speedY: (Math.random() - 0.5) * 0.45,
    alpha: Math.random() * 0.5 + 0.2
  };
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((particle, index) => {
    particle.x += particle.speedX;
    particle.y += particle.speedY;

    if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
    if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(34, 211, 238, ${particle.alpha})`;
    ctx.fill();

    for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
      const next = particles[nextIndex];
      const distance = Math.hypot(particle.x - next.x, particle.y - next.y);
      if (distance < 120) {
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(next.x, next.y);
        ctx.strokeStyle = `rgba(124, 92, 255, ${(1 - distance / 120) * 0.18})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(animateParticles);
}
