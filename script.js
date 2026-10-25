/**
 * Muhammad Rafif Nararya — Portfolio Interactive Engine
 * Features:
 * - Particle constellation canvas
 * - Typewriter text effect
 * - Python code executor & interactive terminal simulator
 * - 3D spotlight card mouse tracking
 * - Live POS Kasir simulation modal
 * - Dynamic skills filter
 * - Clipboard copy with toast notifications
 * - Circular scroll progress & back-to-top
 * - Scrollspy & smooth navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initTypewriter();
  initCodeRunner();
  initSpotlightEffect();
  initSkillsFilter();
  initKasirSimulator();
  initCopyEmail();
  initContactForm();
  initScrollProgress();
  initMobileNav();
  initScrollReveal();
});

/* ==========================================================================
   1. Particle Constellation Canvas
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 100 };

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  const particleCount = Math.min(Math.floor(window.innerWidth / 18), 65);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 1.6 + 0.8;
      this.baseAlpha = Math.random() * 0.45 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      // Mouse gentle interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56, 189, 248, ${this.baseAlpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const alpha = (1 - dist / 110) * 0.16;
          ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Update and draw particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. Typewriter Effect
   ========================================================================== */
function initTypewriter() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'Beginner Developer 🚀',
    'Mengembangkan Modern POS App 💳',
    'Python & Web Learner 🐍',
    'Curious Problem Solver 🔍',
    'Belajar Satu Langkah Setiap Hari 🌱'
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function type() {
    const currentPhrase = phrases[phraseIdx];

    if (isDeleting) {
      el.textContent = currentPhrase.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 40;
    } else {
      el.textContent = currentPhrase.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 85;
    }

    if (!isDeleting && charIdx === currentPhrase.length) {
      typingSpeed = 1900; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typingSpeed = 450; // Pause before typing next word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   3. Code Runner & Interactive Terminal Simulator
   ========================================================================== */
function initCodeRunner() {
  const runBtn = document.getElementById('run-code-btn');
  const terminalOutput = document.getElementById('terminal-output');
  const clearBtn = document.getElementById('terminal-clear');
  const tabCode = document.getElementById('tab-code');
  const tabTerminal = document.getElementById('tab-terminal');
  const terminalDrawer = document.getElementById('terminal-drawer');

  if (!runBtn || !terminalOutput) return;

  tabCode?.addEventListener('click', () => {
    tabCode.classList.add('active');
    tabTerminal?.classList.remove('active');
    terminalDrawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  tabTerminal?.addEventListener('click', () => {
    tabTerminal.classList.add('active');
    tabCode?.classList.remove('active');
    terminalDrawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  clearBtn?.addEventListener('click', () => {
    terminalOutput.innerHTML = `
      <div class="t-line"><span class="t-prompt">$</span> terminal dibersihkan.</div>
      <div class="t-line t-info">&gt; Tekan tombol 'Jalankan' untuk mengeksekusi script kembali.</div>
    `;
  });

  runBtn.addEventListener('click', () => {
    runBtn.disabled = true;
    runBtn.style.opacity = '0.7';

    terminalOutput.innerHTML = `<div class="t-line"><span class="t-prompt">$</span> python profil_rafif.py</div>`;

    const logs = [
      { text: '&gt; [1/4] Menyiapkan environment Python...', class: 't-line' },
      { text: '&gt; [2/4] Memuat data objek: Muhammad Rafif Nararya (Instagram: @rapup_)', class: 't-line t-info' },
      { text: '&gt; [3/4] Status Project: Mengembangkan Aplikasi Kasir Modern (POS App) 💳', class: 't-line t-info' },
      { text: '&gt; [4/4] Menjalankan semboyan()...', class: 't-line t-success' },
      { text: '&gt; "Mulai dari dasar, berkembang setiap hari." ✨', class: 't-line t-quote' },
      { text: '&gt; Process finished with exit code 0 (0.08s)', class: 't-line t-success' }
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        const line = document.createElement('div');
        line.className = log.class;
        line.innerHTML = log.text;
        terminalOutput.appendChild(line);
        terminalDrawer.scrollTop = terminalDrawer.scrollHeight;

        if (index === logs.length - 1) {
          runBtn.disabled = false;
          runBtn.style.opacity = '1';
          showToast('Kode berhasil dieksekusi! 🚀');
        }
      }, (index + 1) * 320);
    });
  });
}

/* ==========================================================================
   4. 3D Spotlight Card Effect
   ========================================================================== */
function initSpotlightEffect() {
  const cards = document.querySelectorAll('.spotlight-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ==========================================================================
   5. Skills Category Filter
   ========================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   6. Kasir Simulator Modal
   ========================================================================== */
function initKasirSimulator() {
  const openBtns = document.querySelectorAll('.demo-kasir-btn');
  const modal = document.getElementById('kasir-modal');
  const closeBtn = document.getElementById('modal-close');
  const screen = document.getElementById('sim-screen');
  const simBtns = document.querySelectorAll('.sim-btn');

  if (!modal || !screen) return;

  let cart = [];
  let total = 0;

  const prices = {
    kopi: { name: 'Kopi Robusta', price: 18000 },
    roti: { name: 'Roti Bakar Coklat', price: 15000 },
    teh: { name: 'Teh Es Manis', price: 8000 }
  };

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
    });
  });

  closeBtn?.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });

  simBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');

      if (action === 'reset') {
        cart = [];
        total = 0;
        screen.innerHTML = `
          <div class="st-row st-accent">=== KASIR PYTHON SIMULATOR ===</div>
          <div class="st-row">Keranjang dikosongkan. Siap untuk transaksi baru!</div>
        `;
        return;
      }

      if (action === 'bayar') {
        if (cart.length === 0) {
          screen.innerHTML += `<div class="st-row" style="color:#ef4444">&gt; Keranjang masih kosong! Silakan pilih item dulu.</div>`;
          screen.scrollTop = screen.scrollHeight;
          return;
        }

        const dateStr = new Date().toLocaleTimeString('id-ID');
        screen.innerHTML += `
          <div class="st-row st-accent">================ STRUK TRANSAKSI ================</div>
          <div class="st-row">Waktu: ${dateStr} | Kasir: Rafif Nararya</div>
          <div class="st-row">Total Item: ${cart.length} item</div>
          <div class="st-row st-total">TOTAL DIBAYAR: Rp ${total.toLocaleString('id-ID')} [LUNAS ✓]</div>
          <div class="st-row st-green">&gt; Terima kasih telah berbelanja! Sistem bekerja 100% lancar.</div>
          <div class="st-row st-accent">=================================================</div>
        `;
        cart = [];
        total = 0;
        screen.scrollTop = screen.scrollHeight;
        showToast('Transaksi kasir berhasil dicetak! 🧾');
        return;
      }

      const item = prices[action];
      if (item) {
        cart.push(item);
        total += item.price;
        screen.innerHTML += `
          <div class="st-row st-green">&gt; [+] ${item.name} ditambahkan: Rp ${item.price.toLocaleString('id-ID')}</div>
          <div class="st-row">&gt; Subtotal saat ini: Rp ${total.toLocaleString('id-ID')}</div>
        `;
        screen.scrollTop = screen.scrollHeight;
      }
    });
  });
}

/* ==========================================================================
   7. Copy Email with Toast
   ========================================================================== */
function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');
  const emailText = document.getElementById('email-address')?.textContent || 'rafifnararya00@gmail.com';
  const copyLabel = document.getElementById('copy-label');

  if (!copyBtn) return;

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(emailText.trim());
      copyLabel.textContent = 'Tersalin! ✓';
      copyBtn.style.borderColor = '#10b981';
      copyBtn.style.color = '#10b981';

      showToast('Alamat email disalin ke clipboard! 📋');

      setTimeout(() => {
        copyLabel.textContent = 'Salin';
        copyBtn.style.borderColor = '';
        copyBtn.style.color = '';
      }, 2500);
    } catch (err) {
      showToast('Gagal menyalin email otomatis.');
    }
  });
}

/* ==========================================================================
   8. Contact Form Simulation
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const submitBtn = document.getElementById('form-submit-btn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    const msg = document.getElementById('form-msg').value;

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Mengirim Pesan...</span>`;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Terkirim! ✓</span>`;

      if (status) {
        status.className = 'form-feedback success';
        status.textContent = `Terima kasih, ${name}! Pesan Anda telah tercatat. Saya akan segera merespons ke ${email}.`;
      }

      showToast(`Pesan dari ${name} berhasil dikirim! ✉️`);
      form.reset();

      setTimeout(() => {
        submitBtn.innerHTML = `<span>Kirim Pesan Sekarang</span>`;
      }, 4000);
    }, 1200);
  });
}

/* ==========================================================================
   9. Scroll Progress & Back to Top
   ========================================================================== */
function initScrollProgress() {
  const scrollBtn = document.getElementById('scroll-top');
  const progressFill = document.getElementById('progress-ring-fill');
  const header = document.getElementById('site-header');

  if (!scrollBtn || !progressFill) return;

  const circumference = 2 * Math.PI * 19; // r = 19
  progressFill.style.strokeDasharray = `${circumference} ${circumference}`;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = scrollTop / (docHeight || 1);

    // Update circular progress ring
    const offset = circumference - (scrollPercent * circumference);
    progressFill.style.strokeDashoffset = offset;

    // Show/hide scroll top button
    if (scrollTop > 400) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }

    // Header styling on scroll
    if (header) {
      if (scrollTop > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    updateScrollspy();
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function updateScrollspy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollY = window.scrollY + 140;

  sections.forEach(sec => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    const id = sec.getAttribute('id');

    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

/* ==========================================================================
   10. Mobile Navigation Toggle
   ========================================================================== */
function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  const links = document.querySelectorAll('.nav-link, .nav-cta');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.classList.toggle('active');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', false);
    });
  });
}

/* ==========================================================================
   11. Scroll Reveal Animations (IntersectionObserver)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.section-header, .about-card, .principle-card, .skill-card, .project-showcase, .ai-card, .contact-info-card, .contact-form-card'
  );

  if (!('IntersectionObserver' in window)) return;

  revealElements.forEach(el => el.classList.add('reveal-on-scroll'));

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   Toast Notification Helper
   ========================================================================== */
function showToast(msg) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-message');
  if (!toast || !msgEl) return;

  msgEl.textContent = msg;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
