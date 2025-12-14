const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const message = document.getElementById("message");
const randomLine = document.getElementById("randomLine");
const musicBtn = document.getElementById("musicBtn");
const bgMusic = document.getElementById("bgMusic");
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
const emojiRain = document.getElementById("emojiRain");

// Setup canvas for confetti
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Track No button clicks
let noClickCount = 0;

// Emoji rain function
function createEmojiRain() {
  const emojis = ["💚", "🌿", "🍀", "✨", "💘"];
  for (let i = 0; i < 5; i++) {
    const emoji = document.createElement("div");
    emoji.className = "emoji-particle";
    emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    emoji.style.left = Math.random() * 100 + "%";
    emoji.style.top = -50 + "px";
    emoji.style.animation = `fall ${5 + Math.random() * 3}s linear forwards`;
    emoji.style.animationDelay = Math.random() * 0.5 + "s";
    emoji.style.opacity = "0.5";
    emojiRain.appendChild(emoji);

    setTimeout(() => emoji.remove(), 9000);
  }
}

// Add CSS animation for falling emojis
const style = document.createElement("style");
style.textContent = `
  @keyframes fall {
    to {
      transform: translateY(${window.innerHeight}px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Trigger emoji rain continuously
setInterval(createEmojiRain, 8000);
createEmojiRain();
const specialLines = [
    
  "\"I wanna do like the cat forever\" 🐾",
  "\"Voglio fare come il gatto per sempre\" 🐾",
  "\"You're my favorite person\" ❤️",
  "\"Sei la mia persona preferita\" ❤️",

  "\"Mi manchi\" ❤️",

  

  "\"Stay with me forever\" 💞",
  "\"Resta con me per sempre\" 💞",

  "\"You make me smile every day\" 💖",
  "\"Mi fai sorridere ogni giorno\" 💖",

  "\"I love your voice\" 😊",
  "\"Amo la tua voce\" 😊",

  "\"Forever with you\" ♾️❤️",
  "\"Per sempre con te\" ♾️❤️",

  "\"You're my everything\" 💓",
  "\"Sei il mio tutto\" 💓",

  "\"I wanna do like the cat forever\" 🐾",
  "\"Voglio fare come il gatto per sempre\" 🐾",

  "\"Te amo\" 💞",
  "\"Ti amo\" 💞",

"\"Mi manchi tanto\" ❤️",

  "\"I'm in love with you\" 💞",
  "\"Sono innamorato di te\" 💞"
];

// Display a random line when the page loads
function displayRandomLine() {
  const randomIndex = Math.floor(Math.random() * specialLines.length);
  randomLine.textContent = specialLines[randomIndex];
  randomLine.style.animation = 'none';
  setTimeout(() => {
    randomLine.style.animation = 'fadeInQuote 0.6s ease-in';
  }, 10);
}

// Show a new random line every 4 seconds
displayRandomLine();
setInterval(displayRandomLine, 4000);

// Music control
musicBtn.addEventListener("click", () => {
  bgMusic.muted = false;
  if (bgMusic.paused) {
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          musicBtn.textContent = "🎵 Music Playing...";
        })
        .catch((error) => {
          console.log("Autoplay prevented:", error);
          musicBtn.textContent = "🎵 Play Music";
        });
    } else {
      musicBtn.textContent = "🎵 Music Playing...";
    }
  } else {
    bgMusic.pause();
    musicBtn.textContent = "🎵 Play Music";
  }
});

yesBtn.addEventListener("click", () => {
  message.innerHTML = "Best answer. Now you're stuck with me forever 💍<br><span style='font-size: 0.9em; color: #10b981;'>La risposta giusta. Ora sei intrappolata con me per sempre 💍</span>";
  launchConfetti();
  createSuccessAnimation();
  triggerHaptic();
  bgMusic.muted = false;
  bgMusic.play();
});

// Desktop: mouseover; Mobile: touchstart; Fallback: click
noBtn.addEventListener("mouseover", moveNoButton);
noBtn.addEventListener("touchstart", moveNoButton, { passive: true });
noBtn.addEventListener("click", () => {
  noClickCount++;
  moveNoButton();
  shakeContainer();
  triggerHaptic();
});

// Confetti animation
class Confetti {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height - canvas.height;
    this.size = Math.random() * 8 + 4;
    this.speedY = Math.random() * 3 + 2;
    this.speedX = Math.random() * 2 - 1;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = Math.random() * 0.1 - 0.05;
    this.color = ["#10b981", "#34d399", "#059669", "#047857", "#fef9c3", "#111827"][
      Math.floor(Math.random() * 6)
    ];
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
  confettis = [];
  for (let i = 0; i < 100; i++) {
    confettis.push(new Confetti());
  }
  animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confettis = confettis.filter((c) => c.y < canvas.height);

  confettis.forEach((confetti) => {
    confetti.update();
    confetti.draw();
  });

  if (confettis.length > 0) {
    requestAnimationFrame(animateConfetti);
  }
}

// Shake animation
function shakeContainer() {
  const container = document.querySelector(".container");
  container.style.animation = "none";
  setTimeout(() => {
    container.style.animation = "shake 0.3s ease-in-out";
  }, 10);
}

// Success animation with emoji burst
function createSuccessAnimation() {
  const successEmojis = ["💍", "💚", "🎉", "✨", "🌹"];
  for (let i = 0; i < 20; i++) {
    const emoji = document.createElement("div");
    emoji.className = "emoji-particle";
    emoji.textContent = successEmojis[Math.floor(Math.random() * successEmojis.length)];
    emoji.style.left = window.innerWidth / 2 + "px";
    emoji.style.top = window.innerHeight / 2 + "px";
    emoji.style.fontSize = "3rem";
    emoji.style.animation = `burst ${2}s ease-out forwards`;
    emoji.style.animationDelay = Math.random() * 0.3 + "s";
    emojiRain.appendChild(emoji);

    setTimeout(() => emoji.remove(), 2500);
  }
}

// Haptic feedback for mobile
function triggerHaptic() {
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
}

// Lightbox functionality
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const closeBtn = document.querySelector(".lightbox .close");
const galleryImages = document.querySelectorAll(".gallery-image");

galleryImages.forEach((img) => {
  img.addEventListener("click", () => {
    lightbox.classList.add("active");
    lightboxImg.src = img.src;
  });
});

closeBtn.addEventListener("click", () => {
  lightbox.classList.remove("active");
});

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    lightbox.classList.remove("active");
  }
});
function moveNoButton(event) {
  if (event) event.preventDefault();

  const container = document.querySelector(".container");
  const rect = container.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  // Calculate the maximum distance the button can safely move within container
  const maxMoveX = (rect.width - btnRect.width) / 2 - 10;
  const maxMoveY = (rect.height - btnRect.height) / 2 - 10;

  // Generate random movement centered around 0, within safe bounds
  const randomX = (Math.random() - 0.5) * maxMoveX * 2;
  const randomY = (Math.random() - 0.5) * maxMoveY * 2;

  noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
}





