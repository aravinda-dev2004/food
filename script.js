// Initialize VanillaTilt for 3D effects
document.addEventListener("DOMContentLoaded", () => {
  // Select all cards that should have the tilt effect
  const cards = document.querySelectorAll(".recipe-card, .method-card, .feedback-card");

  // Initialize VanillaTilt on these elements
  VanillaTilt.init(cards, {
    max: 15,            // Max tilt rotation (degrees)
    speed: 400,         // Speed of the enter/exit transition
    glare: true,        // Add a glare effect
    "max-glare": 0.5,   // Max opacity of the glare
    scale: 1.05         // Scale up on hover
  });

  // Scroll Reveal Animation
  const revealElements = document.querySelectorAll(".recipe-card, .method-card, .feedback-card, .content-section h2, .content-section p");

  // Add 'reveal' class to all target elements initially
  revealElements.forEach(element => {
    element.classList.add("reveal");
  });

  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 150;

    revealElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;

      if (elementTop < windowHeight - elementVisible) {
        element.classList.add("active");
      } else {
        // Optional: remove active class to re-animate on scroll up
        // element.classList.remove("active");
      }
    });
  };

  window.addEventListener("scroll", revealOnScroll);
  // Trigger once on load to show visible elements
  revealOnScroll();
});

/* ===== Antigravity Particle Background ===== */
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.zIndex = "-1";
canvas.style.pointerEvents = "none"; // Allow clicks to pass through

let width, height;
let particles = [];

// Responsive Canvas Size
function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Mouse tracking
const mouse = { x: null, y: null, radius: 150 };

window.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

// Particle Class
class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = Math.random() * 2 + 1;
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = (Math.random() * 30) + 1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-color').trim() === '#f0f0f0' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)';
    ctx.fill();
  }

  update() {
    // Mouse Interaction
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let forceDirectionX = dx / distance;
    let forceDirectionY = dy / distance;
    let maxDistance = mouse.radius;
    let force = (maxDistance - distance) / maxDistance;
    let directionX = forceDirectionX * force * this.density;
    let directionY = forceDirectionY * force * this.density;

    if (distance < mouse.radius) {
      this.x -= directionX;
      this.y -= directionY;
    } else {
      // Return to original position or keep floating
      if (this.x !== this.baseX) {
        let dx = this.x - this.baseX;
        this.x -= dx / 10;
      }
      if (this.y !== this.baseY) {
        let dy = this.y - this.baseY;
        this.y -= dy / 10;
      }
    }

    // Auto movement
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off edges
    if (this.x < 0 || this.x > width) this.vx = -this.vx;
    if (this.y < 0 || this.y > height) this.vy = -this.vy;

    this.draw();
  }
}

function initParticles() {
  particles = [];
  let numberOfParticles = (width * height) / 9000;
  for (let i = 0; i < numberOfParticles; i++) {
    particles.push(new Particle());
  }
}

initParticles();

// Connecting Lines
function connect() {
  let opacityValue = 1;
  const isDarkMode = getComputedStyle(document.body).getPropertyValue('--text-color').trim() === '#f0f0f0';
  const strokeColor = isDarkMode ? '255, 255, 255' : '0, 0, 0';

  for (let i = 0; i < particles.length; i++) {
    for (let j = i; j < particles.length; j++) {
      let distance = ((particles[i].x - particles[j].x) * (particles[i].x - particles[j].x)) +
        ((particles[i].y - particles[j].y) * (particles[i].y - particles[j].y));

      if (distance < (width * height) / 100) { // Connection distance
        opacityValue = 1 - (distance / 20000);
        ctx.strokeStyle = `rgba(${strokeColor}, ${opacityValue})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, width, height);
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
  }
  connect();
}

animate();

// Re-init particles on window resize
window.addEventListener('resize', () => {
  width = window.innerWidth;
  height = window.innerHeight;
  initParticles();
});

