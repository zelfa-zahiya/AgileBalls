// Mengambil elemen canvas dan context
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

// Set dimensi canvas
canvas.width = innerWidth;
canvas.height = innerHeight;

// Variabel skor
let score = 0;
const scoreEl = document.getElementById('scoreEl');
const startGameBtn = document.getElementById('startGameBtn');
const modalEl = document.getElementById('modalEl');
const finalScoreEl = modalEl.querySelector('h1');

// Classes
class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }
}

class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }

  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }

  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

// Variabel utama
const player = new Player(canvas.width / 2, canvas.height / 2, 20, 'white');
const projectiles = [];
const enemies = [];

// Fungsi untuk spawn musuh
function spawnEnemies() {
  setInterval(() => {
    const radius = Math.random() * (30 - 10) + 10;
    let x, y;

    // Posisi musuh secara acak
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }

    const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
    const angle = Math.atan2(player.y - y, player.x - x);
    
    // Mengurangi kecepatan dengan faktor 0.5
    const speed = 0.8;
    const velocity = {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed,
    };

    enemies.push(new Enemy(x, y, radius, color, velocity));
  }, 1500); // Ubah 1000 menjadi 1500 (lebih lama)
}

// Fungsi animasi utama
function animate() {
  const animationId = requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height); // Membersihkan canvas

  player.draw();

  projectiles.forEach((projectile, index) => {
    projectile.update();

    // Hapus proyektil jika keluar dari layar
    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(index, 1);
      }, 0);
    }
  });

  enemies.forEach((enemy, enemyIndex) => {
    enemy.update();

 // Game over jika musuh mengenai pemain
 const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
 if (dist - enemy.radius - player.radius < 1) {
   cancelAnimationFrame(animationId);
   finalScoreEl.textContent = score;
   modalEl.style.display = 'flex';
   return;
 }

 // Jika proyektil mengenai musuh
 projectiles.forEach((projectile, projectileIndex) => {
   const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

   if (dist - enemy.radius - projectile.radius < 1) {
     setTimeout(() => {
       enemies.splice(enemyIndex, 1);
       projectiles.splice(projectileIndex, 1);
       score += 100;
       scoreEl.textContent = score;
     }, 0);
   }
 });
});
}

// Menambahkan proyektil saat klik
addEventListener('click', (event) => {
  const angle = Math.atan2(event.clientY - player.y, event.clientX - player.x);
  const velocity = {
    x: Math.cos(angle) * 5,
    y: Math.sin(angle) * 5,
  };
  projectiles.push(new Projectile(player.x, player.y, 5, 'white', velocity));
});

// Ambil elemen nama kelompok
const teamNameEl = document.getElementById('teamName');

// Memulai game
startGameBtn.addEventListener('click', () => {
  score = 0;
  scoreEl.textContent = score;
  projectiles.length = 0;
  enemies.length = 0;
  
  // Sembunyikan nama kelompok sebelum game dimulai
  teamNameEl.style.display = 'none'; // Menyembunyikan nama kelompok saat start game ditekan
  
  modalEl.style.display = 'none'; // Menutup modal
  animate(); // Mulai animasi game
  spawnEnemies(); // Mulai spawn musuh
});