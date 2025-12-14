const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const message = document.getElementById('message');
const randomLine = document.getElementById('randomLine');
const musicBtn = document.getElementById('musicBtn');
const bgMusic = document.getElementById('bgMusic');
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
const emojiRain = document.getElementById('emojiRain');

// Typewriter effect for heading
function typeWriter() {
  const h1 = document.querySelector('h1');
  const englishSpan = h1.querySelector('span:first-child');
  const italianSpan = h1.querySelector('.it');
  
  const englishText = 'Will you be my girlfriend, Laura?';
  const italianText = 'Vuoi essere la mia ragazza, Laura?';
  
  let index = 0;
  
  function typeCharacter() {
    if (index < englishText.length) {
      englishSpan.textContent = englishText.substring(0, index + 1);
      italianSpan.textContent = italianText.substring(0, index + 1);
      index++;
      setTimeout(typeCharacter, 40);
    }
  }
  
  typeCharacter();
}

// Start typewriter on page load
document.addEventListener('DOMContentLoaded', typeWriter);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

let noClickCount = 0;

const specialLines = [
  "You are my addiction", "Sei la mia dipendenza",
  "i cannot stop thinking about you", "Non riesco a smettere di pensare a te",
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

// Typing effect
function typeWriter(element, text, speed = 100) {
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

window.addEventListener('load', () => {
  const h1Spans = document.querySelectorAll('h1 span');
  if (h1Spans[0]) typeWriter(h1Spans[0], "Will you be my girlfriend, Laura?", 80);
  setTimeout(() => {
    if (h1Spans[1]) typeWriter(h1Spans[1], "Vuoi essere la mia ragazza, Laura?", 80);
  }, 2200);
  
  displayRandomLine();
});

// Emoji rain
function createEmojiRain() {
  const emojis = ['💖', '💕', '❤️', '✨', '🌟'];
  for (let i = 0; i < 5; i++) {
    const emoji = document.createElement('div');
    emoji.className = 'emoji-particle';
    emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    emoji.style.left = Math.random() * 100 + '%';
    emoji.style.top = '-50px';
    emoji.style.animation = `fall ${5 + Math.random() * 3}s linear forwards`;
    emoji.style.animationDelay = Math.random() * 0.5 + 's';
    emoji.style.opacity = 0.5 + Math.random() * 0.3;
    emojiRain.appendChild(emoji);
    setTimeout(() => emoji.remove(), 9000);
  }
}

const style = document.createElement('style');
style.textContent = '@keyframes fall { to { transform: translateY(100vh); opacity: 0; } }';
document.head.appendChild(style);

setInterval(createEmojiRain, 8000);
createEmojiRain();

// Progressive hearts
setInterval(() => {
  const heart = document.createElement('div');
  heart.className = 'emoji-particle';
  heart.textContent = '❤️';
  heart.style.left = Math.random() * 100 + '%';
  heart.style.top = '90%';
  heart.style.fontSize = '1.5rem';
  heart.style.animation = 'floatUp 4s ease-out forwards';
  heart.style.zIndex = '5';
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 4000);
}, 2500);

// Random romantic lines
function displayRandomLine() {
  const randomIndex = Math.floor(Math.random() * specialLines.length);
  randomLine.textContent = specialLines[randomIndex];
  randomLine.style.animation = 'none';
  setTimeout(() => randomLine.style.animation = 'fadeInQuote 0.6s ease-in', 10);
}

setInterval(displayRandomLine, 2500);

// Music control
musicBtn.addEventListener('click', () => {
  bgMusic.muted = false;
  if (bgMusic.paused) {
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        musicBtn.textContent = 'Music Playing 🎵';
      }).catch(error => {
        console.log('Autoplay prevented', error);
        musicBtn.textContent = 'Play Music';
      });
    }
  } else {
    bgMusic.pause();
    musicBtn.textContent = 'Music Playing 🎵';
  }
});

// Yes button
yesBtn.addEventListener('click', () => {
  message.innerHTML = 'Best answer. Now you\'re stuck with me forever!<br><span style="font-size: 0.9em; color: #10b981;">La risposta giusta. Ora sei intrappolata con me per sempre ❤️</span>';
  launchConfetti();
  createSuccessAnimation();
  triggerHaptic();
  bgMusic.muted = false;
  bgMusic.play();
});

// No button interactions
noBtn.addEventListener('mouseover', moveNoButton);
noBtn.addEventListener('touchstart', moveNoButton, { passive: true });
noBtn.addEventListener('click', () => {
  noClickCount++;
  moveNoButton();
  shakeContainer();
  triggerHaptic();
});

// Confetti
class Confetti {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height - canvas.height;
    this.size = Math.random() * 4 + 4;
    this.speedY = Math.random() * 2 + 3;
    this.speedX = Math.random() * 4 - 2;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = Math.random() * 0.2 - 0.1;
    this.color = ['#10b981', '#34d399', '#059669', '#047857', '#fef9c3', '#111827'][Math.floor(Math.random() * 6)];
  }
  
  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.rotation += this.rotationSpeed;
    this.speedY += 0.1; // gravity
  }
  
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    ctx.restore();
  }
}

let confettis = [];
function launchConfetti() {
  for (let i = 0; i < 100; i++) {
    confettis.push(new Confetti());
  }
  animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confettis = confettis.filter(c => c.y < canvas.height);
  confettis.forEach(confetti => {
    confetti.update();
    confetti.draw();
  });
  if (confettis.length > 0) requestAnimationFrame(animateConfetti);
}

// Animations
function shakeContainer() {
  const container = document.querySelector('.container');
  container.style.animation = 'none';
  setTimeout(() => container.style.animation = 'shake 0.3s ease-in-out', 10);
}

function createSuccessAnimation() {
  const successEmojis = ['🎉', '✨', '💖', '🌟', '❤️'];
  for (let i = 0; i < 20; i++) {
    const emoji = document.createElement('div');
    emoji.className = 'emoji-particle';
    emoji.textContent = successEmojis[Math.floor(Math.random() * successEmojis.length)];
    emoji.style.left = (window.innerWidth / 2) + 'px';
    emoji.style.top = (window.innerHeight / 2) + 'px';
    emoji.style.fontSize = '3rem';
    emoji.style.animation = `burst 2s ease-out forwards`;
    emoji.style.animationDelay = Math.random() * 0.3 + 's';
    emojiRain.appendChild(emoji);
    setTimeout(() => emoji.remove(), 2500);
  }
}

function triggerHaptic() {
  if (navigator.vibrate) navigator.vibrate(50);
}

// Parallax gallery
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const parallax = document.querySelectorAll('.gallery-image');
  parallax.forEach(img => {
    const speed = 0.3;
    img.style.transform = `translateY(${scrolled * speed}px) scale(1 + scrolled * 0.0005)`;
  });
});

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const closeBtn = document.querySelector('.lightbox .close');
const galleryImages = document.querySelectorAll('.gallery-image');

galleryImages.forEach(img => {
  img.addEventListener('click', () => {
    lightbox.classList.add('active');
    lightboxImg.src = img.src;
  });
});

closeBtn.addEventListener('click', () => lightbox.classList.remove('active'));
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) lightbox.classList.remove('active');
});

function moveNoButton(event) {
  if (event) event.preventDefault();
  const noBtn = document.getElementById('noBtn');
  const container = document.querySelector('.container');
  
  if (!container) return;
  
  const containerRect = container.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();
  
  // Calculate safe boundaries within container
  const maxX = containerRect.width - btnRect.width - 20;
  const maxY = containerRect.height - btnRect.height - 20;
  
  const randomX = Math.random() * maxX - maxX / 2;
  const randomY = Math.random() * maxY - maxY / 2;
  
  // Clamp to safe bounds
  const clampedX = Math.max(-maxX / 2 + 20, Math.min(maxX / 2 - 20, randomX));
  const clampedY = Math.max(-maxY / 2 + 20, Math.min(maxY / 2 - 20, randomY));
  
  noBtn.style.transform = `translate(${clampedX}px, ${clampedY}px)`;
}
