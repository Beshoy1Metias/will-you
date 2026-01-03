const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const message = document.getElementById('message');
const randomLine = document.getElementById('randomLine');
const musicBtn = document.getElementById('audioToggleBtn') || document.getElementById('musicBtn');
const bgMusic = document.getElementById('bgMusic');
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
const emojiRain = document.getElementById('emojiRain');

// --- Three.js Background ---
function initThreeJS() {
  const container = document.getElementById('canvas-container');
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // Particles (Hearts or Soft Circles)
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 300;

  const posArray = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i++) {
    // Spread them wide
    posArray[i] = (Math.random() - 0.5) * 15;
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

  // Create a soft circle texture programmatically
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 32, 32);

  const texture = new THREE.CanvasTexture(canvas);

  const material = new THREE.PointsMaterial({
    size: 0.15,
    map: texture,
    transparent: true,
    opacity: 0.6,
    color: 0x10b981,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particlesMesh = new THREE.Points(particlesGeometry, material);
  scene.add(particlesMesh);

  camera.position.z = 5;

  // Animation Loop
  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX / window.innerWidth - 0.5;
    mouseY = event.clientY / window.innerHeight - 0.5;
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Gentle rotation
    particlesMesh.rotation.y = elapsedTime * 0.05;
    particlesMesh.rotation.x = -mouseY * 0.2;
    particlesMesh.rotation.y += mouseX * 0.2;

    // Pulse effect
    material.size = 0.15 + Math.sin(elapsedTime * 2) * 0.02;

    renderer.render(scene, camera);
  }

  animate();

  // Resize Handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// --- Text Effects ---
function typeWriter(element, text, speed = 60) {
  element.innerHTML = '';
  let i = 0;
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

const specialLines = [
  "You are my addiction", "Sei la mia dipendenza",
  "I cannot stop thinking about you", "Non riesco a smettere di pensare a te",
  "Stay with me forever", "Resta con me per sempre",
  "You make me smile every day", "Mi fai sorridere ogni giorno",
  "I love your voice", "Amo la tua voce",
  "Forever with you", "Per sempre con te",
  "I'm addicted to you", "Sono dipendente da te",
  "You're my everything", "Sei il mio tutto",
  "I wanna do like the cat forever", "Voglio fare come il gatto per sempre",
  "Te amo", "Ti amo",
  "I'm in love with you", "Sono innamorato di te"
];

// Random Lines Logic
function setupRandomLine(elementId, interval) {
  const element = document.getElementById(elementId);
  if (!element) return;

  function update() {
    const randomIndex = Math.floor(Math.random() * specialLines.length);
    // Fade out
    element.style.opacity = '0';
    element.style.transform = 'translateY(5px)';
    element.style.transition = 'all 0.4s ease';

    setTimeout(() => {
      element.textContent = specialLines[randomIndex];
      // Fade in
      element.style.opacity = '1'; // or 0.8 for secondary
      element.style.transform = 'translateY(0)';
    }, 400);
  }

  // Initial call
  update();
  // Loop
  setInterval(update, interval);
}

// Timeline Observer
function initTimeline() {
  const items = document.querySelectorAll('.timeline-item');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });

  items.forEach(item => observer.observe(item));
}


// Start randomness (staggered)
setupRandomLine('randomLine', 3500);
setTimeout(() => setupRandomLine('extraLine', 4100), 2000); // Offset start

// Initial Load
window.addEventListener('load', () => {
  const h1Spans = document.querySelectorAll('h1 span');
  const subtitle = document.querySelector('.subtitle');

  // Init New Features
  initThreeJS();
  initTimeline();

  // Add pulse class to yes button
  setTimeout(() => yesBtn.classList.add('pulse'), 2000);

  // 1. English Typing
  if (h1Spans[0]) typeWriter(h1Spans[0], "Will you be my girlfriend, Laura?", 60);

  // 2. Italian Typing (Delayed)
  setTimeout(() => {
    if (h1Spans[1]) typeWriter(h1Spans[1], "Vuoi essere la mia ragazza, Laura?", 50);
  }, 2500);

  // 3. Subtitle Fade In (After typing finishes)
  // 2500ms start + (32 chars * 50ms) = ~4100ms finish. Let's do 4500ms.
  setTimeout(() => {
    if (subtitle) {
      subtitle.style.opacity = '0.9';
      subtitle.style.transform = 'translateY(0)';
    }
  }, 4500);

  displayRandomLine();

  // Resize canvas
  resizeCanvas();
});

// --- Audio Control ---
function fadeInMusic() {
  bgMusic.volume = 0;
  bgMusic.muted = false;
  // Smoother fade in
  const fadeInterval = setInterval(() => {
    if (bgMusic.volume < 0.95) {
      bgMusic.volume += 0.02; // Slower increment
    } else {
      clearInterval(fadeInterval);
    }
  }, 100); // Check every 100ms
}



let isMusicPlaying = false;

musicBtn.addEventListener('click', () => {
  bgMusic.muted = false;

  if (!isMusicPlaying) {
    // Play
    bgMusic.currentTime = 0;
    fadeInMusic();
    const playPromise = bgMusic.play();

    if (playPromise !== undefined) {
      playPromise.then(() => {
        isMusicPlaying = true;
        updateMusicButtonState(true);
      }).catch(error => {
        console.log("Audio play failed", error);
        // Fallback or retry logic could go here, but usually interaction allows it
      });
    }
  } else {
    // Pause
    bgMusic.pause();
    isMusicPlaying = false;
    updateMusicButtonState(false);
  }
});

function updateMusicButtonState(isPlaying) {
  if (isPlaying) {
    musicBtn.innerHTML = '<span>Playing Our Song 🎵</span>';
    musicBtn.classList.add('playing');
  } else {
    musicBtn.innerHTML = '<span>Play Our Song 🎵</span>';
    musicBtn.classList.remove('playing');
  }
}

// --- Interaction Logic ---
// Yes Button
yesBtn.addEventListener('click', () => {
  // Hide no button
  noBtn.style.transition = '0.5s';
  noBtn.style.opacity = '0';
  noBtn.style.pointerEvents = 'none';

  yesBtn.innerHTML = 'Yes! ❤️';
  yesBtn.style.transform = 'scale(1.1)';

  // Confetti & Rain
  launchConfetti();
  createHeartExplosion();

  // Vibrations
  if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);

  // Ensure music plays
  if (bgMusic.paused) {
    bgMusic.currentTime = 0;
    fadeInMusic();
    bgMusic.play();
  }

  // Message
  message.innerHTML = `
    <div style="animation: fadeIn 1s ease">
      Best answer! Now you're stuck with me forever!<br>
      <span class="it">La risposta giusta. Ora sei intrappolata con me per sempre ❤️</span>
      <br><br>
      <div id="countdown" style="font-size: 0.9rem; opacity: 0.8; margin-top: 10px;">
        Sending your answer in 3...
      </div>
    </div>
  `;

  // WhatsApp Notification Redirection
  let countdown = 3;
  const countInterval = setInterval(() => {
    countdown--;
    const countEl = document.getElementById('countdown');
    if (countEl) countEl.innerText = `Sending your answer in ${countdown}...`;

    if (countdown <= 0) {
      clearInterval(countInterval);
      // Replace with actual number if provided, otherwise generic link
      // Using generic template for now as user didn't specify number in prompt
      const text = encodeURIComponent("YES! ❤️ I will be your girlfriend! Cento per cento!");
      window.location.href = `https://wa.me/?text=${text}`;
    }
  }, 1000);
});

// No Button Evasion
function moveNoButton(e) {
  if (e) e.preventDefault(); // Prevent touch click

  const container = document.querySelector('.buttons');
  const containerRect = container.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  // Calculate available space
  const maxX = window.innerWidth - btnRect.width - 40;
  const maxY = window.innerHeight - btnRect.height - 40;

  // Get random position outside the immediate vicinity if possible,
  // simply random viewport position is usually best for "running away"
  // providing it stays somewhat visible.

  // Let's keep it local to the container if we can, or expand to body if needed.
  // Actually, random fixed position on screen is funniest.

  let newX = Math.random() * (window.innerWidth - btnRect.width - 20) + 10;
  let newY = Math.random() * (window.innerHeight - btnRect.height - 20) + 10;

  // Temporarily make it fixed so it can go anywhere
  noBtn.style.position = 'fixed';
  noBtn.style.left = newX + 'px';
  noBtn.style.top = newY + 'px';
  noBtn.style.right = 'auto'; // clear the initial right styling
}

noBtn.addEventListener('mouseover', moveNoButton);
noBtn.addEventListener('touchstart', moveNoButton, { passive: false });
noBtn.addEventListener('click', moveNoButton);

// --- Magic Spotlight & Tilt Effect ---
const spotlightCard = document.getElementById('spotlightCard');
if (spotlightCard) {
  const container = spotlightCard.querySelector('.spotlight-container');

  // 1. Spotlight Tracking
  function updateSpotlight(e) {
    const rect = container.getBoundingClientRect();
    let clientX, clientY;

    if (e.touches) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    container.style.setProperty('--x', `${x}%`);
    container.style.setProperty('--y', `${y}%`);
  }

  container.addEventListener('mousemove', updateSpotlight);
  container.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Prevent scroll while using spotlight
    updateSpotlight(e);
  }, { passive: false });

  // 2. 3D Tilt Effect on the Card
  const card = spotlightCard;

  card.addEventListener('mousemove', (e) => {
    const cardRect = card.getBoundingClientRect();
    const cardCenterX = cardRect.left + cardRect.width / 2;
    const cardCenterY = cardRect.top + cardRect.height / 2;

    const deltaX = e.clientX - cardCenterX;
    const deltaY = e.clientY - cardCenterY;

    // Max rotation deg
    const rotateX = (deltaY / (cardRect.height / 2)) * -10; // Inverted
    const rotateY = (deltaX / (cardRect.width / 2)) * 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    // Reset position
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
  });
}

// --- Visual Effects ---
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);

class Confetti {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height - canvas.height;
    this.size = Math.random() * 6 + 4;
    this.speedY = Math.random() * 2 + 2;
    this.speedX = Math.random() * 4 - 2;
    this.color = ['#10b981', '#34d399', '#059669', '#fcd34d', '#f87171'][Math.floor(Math.random() * 5)];
    this.rotation = Math.random() * 360;
  }
  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.rotation += 2;
    if (this.y > canvas.height) this.y = -10;
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    ctx.restore();
  }
}

let confettis = [];
function launchConfetti() {
  for (let i = 0; i < 150; i++) confettis.push(new Confetti());
  animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confettis.forEach(c => { c.update(); c.draw(); });
  requestAnimationFrame(animateConfetti);
}

function createHeartExplosion() {
  for (let i = 0; i < 30; i++) {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.className = 'emoji-particle';
    heart.style.left = '50%';
    heart.style.top = '50%';
    heart.style.fontSize = Math.random() * 20 + 20 + 'px';
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 100 + 50;

    // Animate
    heart.animate([
      { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
      { transform: `translate(calc(-50% + ${Math.cos(angle) * velocity}px), calc(-50% + ${Math.sin(angle) * velocity}px)) scale(1.5)`, opacity: 0 }
    ], {
      duration: 1500,
      easing: 'cubic-bezier(0, .9, .57, 1)'
    }).onfinish = () => heart.remove();

    document.body.appendChild(heart);
  }
}

// Lightbox Navigation
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const images = document.querySelectorAll('.gallery-image');
let currentImageIndex = 0;

// Open Lightbox
images.forEach((img, index) => {
  img.addEventListener('click', () => {
    lightbox.classList.add('active');
    lightboxImg.src = img.src;
    currentImageIndex = index;
  });
});

// Close Lightbox
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox || e.target.classList.contains('close')) {
    lightbox.classList.remove('active');
  }
});

// Navigation Functions
function showImage(index) {
  // Wrap around
  if (index < 0) index = images.length - 1;
  if (index >= images.length) index = 0;

  // Update state
  currentImageIndex = index;

  // Update visual
  const img = images[currentImageIndex];
  lightboxImg.style.opacity = '0'; // Fade switch hint
  setTimeout(() => {
    lightboxImg.src = img.src;
    lightboxImg.style.opacity = '1';
  }, 150);
}

// Keyboard Nav
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'ArrowLeft') showImage(currentImageIndex - 1);
  if (e.key === 'ArrowRight') showImage(currentImageIndex + 1);
  if (e.key === 'Escape') lightbox.classList.remove('active');
});

// Swipe Logic (Touch & Mouse)
let startX = 0;
let endX = 0;

// Touch Events
lightbox.addEventListener('touchstart', (e) => {
  startX = e.changedTouches[0].screenX;
}, { passive: true });

lightbox.addEventListener('touchend', (e) => {
  endX = e.changedTouches[0].screenX;
  handleSwipe();
}, { passive: true });

// Mouse Events (for desktop "swipe")
lightbox.addEventListener('mousedown', (e) => {
  startX = e.screenX;
});

lightbox.addEventListener('mouseup', (e) => {
  endX = e.screenX;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 50; // Minimum distance
  const difference = startX - endX;

  if (Math.abs(difference) > swipeThreshold) {
    if (difference > 0) {
      // Swiped Left -> Next Image
      showImage(currentImageIndex + 1);
    } else {
      // Swiped Right -> Prev Image
      showImage(currentImageIndex - 1);
    }
  }
}
