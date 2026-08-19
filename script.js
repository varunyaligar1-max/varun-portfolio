/* ==========================================================================
   VARUN N YALIGAR - PORTFOLIO INTERACTIVITY SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initThemeToggle();
  initModals();
  initContactForm();
  initAvatarUploader();
});

/* 1. Navbar Scroll Effect */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* 2. Mobile Menu Navigation */
function initMobileMenu() {
  const toggleBtn = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const links = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = toggleBtn.querySelector('i');
    if (navLinks.classList.contains('active')) {
      icon.className = 'fa-solid fa-xmark';
    } else {
      icon.className = 'fa-solid fa-bars';
    }
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      const icon = toggleBtn.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-bars';
    });
  });
}

/* 3. Dark/Light Theme Switcher */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem('varun-portfolio-theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    toggleBtn.querySelector('i').className = 'fa-solid fa-sun';
  }

  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('varun-portfolio-theme', isLight ? 'light' : 'dark');

    const icon = toggleBtn.querySelector('i');
    if (isLight) {
      icon.className = 'fa-solid fa-sun';
      showToast('Switched to Light Mode');
    } else {
      icon.className = 'fa-solid fa-moon';
      showToast('Switched to Dark Mode');
    }
  });
}

/* 4. Modal Window Manager */
function initModals() {
  const triggers = document.querySelectorAll('.modal-trigger');
  const modals = document.querySelectorAll('.modal');
  const closeBtns = document.querySelectorAll('.modal-close');

  triggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal');
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        targetModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modals.forEach(m => m.classList.remove('active'));
      document.body.style.overflow = '';
    });
  });

  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
}

/* 5. Contact Form Handler */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    showToast(`Thank you, ${name}! Your message has been sent.`);
    form.reset();
  });
}

/* 6. Profile Avatar Uploader & LocalStorage Persistence */
function initAvatarUploader() {
  const avatarInput = document.getElementById('avatar-input');
  const profileImg = document.getElementById('profile-img');

  if (!avatarInput || !profileImg) return;

  // Restore saved avatar if exists
  const savedAvatar = localStorage.getItem('varun_portfolio_avatar');
  if (savedAvatar) {
    profileImg.src = savedAvatar;
  } else {
    profileImg.src = 'varun-profile.jpg';
  }

  avatarInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target.result;
      profileImg.src = dataUrl;

      try {
        localStorage.setItem('varun_portfolio_avatar', dataUrl);
        showToast('Profile photo updated!');
      } catch (err) {
        showToast('Photo updated for current session');
      }
    };
    reader.readAsDataURL(file);
  });
}

/* 7. Toast Notification */
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
