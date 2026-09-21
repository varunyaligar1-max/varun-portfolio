/* ==========================================================================
   VARUN N YALIGAR - PORTFOLIO INTERACTIVITY & AI ASSISTANT SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initThemeToggle();
  initModals();
  initContactForm();
  initInboxManager();
  initAvatarUploader();
  initAIAssistant();
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
      openModal(modalId);
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

function openModal(modalId) {
  const targetModal = document.getElementById(modalId);
  if (targetModal) {
    targetModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

/* 5. Contact Form Handler (FormSubmit AJAX & Local Storage Backup) */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) return;

    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending Message...';

    // Store in localStorage Inbox
    saveMessageToInbox({ name, email, message });

    try {
      // Send via FormSubmit AJAX to varunyaligar1@gmail.com
      const response = await fetch('https://formsubmit.co/ajax/varunyaligar1@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          message: message,
          _subject: `New Portfolio Message from ${name}`
        })
      });

      const data = await response.json();

      if (response.ok || data.success === 'true') {
        showToast(`Thank you ${name}! Message sent to Varun.`);
        form.reset();
      } else {
        showToast(`Message saved locally in Inbox! Thank you, ${name}.`);
        form.reset();
      }
    } catch (err) {
      console.warn('Network send fallback triggered:', err);
      showToast(`Saved to Inbox! Thank you, ${name}.`);
      form.reset();
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
}

/* 6. Inbox Local Storage Manager */
function saveMessageToInbox(msgData) {
  const messages = getInboxMessages();
  const newMessage = {
    id: Date.now(),
    name: msgData.name,
    email: msgData.email,
    message: msgData.message,
    timestamp: new Date().toLocaleString()
  };
  messages.unshift(newMessage);
  localStorage.setItem('varun_portfolio_messages', JSON.stringify(messages));
  updateInboxUI();
}

function getInboxMessages() {
  const stored = localStorage.getItem('varun_portfolio_messages');
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
}

function initInboxManager() {
  updateInboxUI();

  const clearBtn = document.getElementById('clear-inbox-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Clear all received inbox messages?')) {
        localStorage.removeItem('varun_portfolio_messages');
        updateInboxUI();
        showToast('Inbox cleared');
      }
    });
  }
}

function updateInboxUI() {
  const countEl = document.getElementById('inbox-count');
  const listEl = document.getElementById('inbox-messages-list');
  const messages = getInboxMessages();

  if (countEl) countEl.textContent = messages.length;

  if (!listEl) return;

  if (messages.length === 0) {
    listEl.innerHTML = `
      <div style="text-align: center; padding: 2rem 1rem; color: var(--text-dim);">
        <i class="fa-solid fa-inbox" style="font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.5;"></i>
        <p>No saved messages yet.</p>
        <p style="font-size: 0.8rem; margin-top: 0.25rem;">Messages submitted via the contact form will appear here.</p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = messages.map(msg => `
    <div class="inbox-card-item">
      <div class="inbox-item-header">
        <div>
          <span class="inbox-sender-name">${escapeHtml(msg.name)}</span>
          <br>
          <a href="mailto:${escapeHtml(msg.email)}" class="inbox-sender-email"><i class="fa-solid fa-envelope"></i> ${escapeHtml(msg.email)}</a>
        </div>
        <span class="inbox-time"><i class="fa-solid fa-clock"></i> ${escapeHtml(msg.timestamp)}</span>
      </div>
      <div class="inbox-msg-body">${escapeHtml(msg.message)}</div>
    </div>
  `).join('');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* 7. Profile Avatar Uploader & LocalStorage Persistence */
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

/* 8. AI Portfolio Assistant Logic */
function initAIAssistant() {
  const triggerBtn = document.getElementById('ai-widget-trigger');
  const chatWindow = document.getElementById('ai-chat-window');
  const closeBtn = document.getElementById('ai-close-btn');
  const clearBtn = document.getElementById('ai-clear-btn');
  const chatForm = document.getElementById('ai-chat-form');
  const chatInput = document.getElementById('ai-chat-input');
  const chatBody = document.getElementById('ai-chat-body');
  const suggestionChips = document.querySelectorAll('.ai-suggestion-chip');
  const openIcon = triggerBtn?.querySelector('.ai-trigger-icon');
  const closeIcon = triggerBtn?.querySelector('.ai-trigger-close-icon');

  if (!triggerBtn || !chatWindow || !chatBody) return;

  let isFirstOpen = true;

  // Toggle Assistant Window
  triggerBtn.addEventListener('click', () => {
    const isOpen = chatWindow.classList.contains('active');
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  });

  closeBtn?.addEventListener('click', closeChat);

  function openChat() {
    chatWindow.classList.add('active');
    if (openIcon) openIcon.style.display = 'none';
    if (closeIcon) closeIcon.style.display = 'block';

    if (isFirstOpen && chatBody.children.length === 0) {
      isFirstOpen = false;
      renderAssistantGreeting();
    }
    setTimeout(() => chatInput?.focus(), 300);
  }

  function closeChat() {
    chatWindow.classList.remove('active');
    if (openIcon) openIcon.style.display = 'block';
    if (closeIcon) closeIcon.style.display = 'none';
  }

  // Clear Chat History
  clearBtn?.addEventListener('click', () => {
    chatBody.innerHTML = '';
    renderAssistantGreeting();
    showToast('AI Chat history reset');
  });

  // Suggestion Chips Click
  suggestionChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const query = chip.getAttribute('data-query');
      if (query) {
        processUserQuery(query);
      }
    });
  });

  // Chat Form Submit
  chatForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = chatInput.value.trim();
    if (!query) return;
    chatInput.value = '';
    processUserQuery(query);
  });

  function renderAssistantGreeting() {
    const greetingHTML = `
      <p>👋 Hello! I am <strong>Varun's AI Portfolio Assistant</strong>.</p>
      <p>I can instantly provide details about Varun N Yaligar's:</p>
      <ul>
        <li><strong>Technical Stack</strong> (Python, FastAPI, OpenCV, YOLO, SQL)</li>
        <li><strong>Featured Projects</strong> (Elephant IoT Warning System, Airline App)</li>
        <li><strong>Education & CGPA</strong> (B.E. AIML @ AIET Moodbidri)</li>
        <li><strong>Contact Info & Resume</strong></li>
      </ul>
      <p>Click any quick prompt above or type your question below!</p>
    `;
    appendMessage('assistant', greetingHTML);
  }

  function processUserQuery(queryText) {
    appendMessage('user', escapeHtml(queryText));

    // Show typing animation indicator
    const typingIndicator = createTypingIndicator();
    chatBody.appendChild(typingIndicator);
    scrollToBottom();

    // Simulate AI thinking time
    setTimeout(() => {
      typingIndicator.remove();
      const response = generateAIResponse(queryText);
      appendMessage('assistant', response.html, response.actions);
    }, 450);
  }

  function appendMessage(role, htmlContent, actions = []) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `ai-message ${role}`;

    let actionsHTML = '';
    if (actions && actions.length > 0) {
      actionsHTML = `<div class="ai-msg-actions">` +
        actions.map(act => `<button class="ai-btn-action" data-action="${act.type}" data-target="${act.target}">${act.label}</button>`).join('') +
        `</div>`;
    }

    msgDiv.innerHTML = `
      <div class="ai-bubble">
        ${htmlContent}
        ${actionsHTML}
      </div>
    `;

    chatBody.appendChild(msgDiv);

    // Bind action button events inside message bubble
    msgDiv.querySelectorAll('.ai-btn-action').forEach(btn => {
      btn.addEventListener('click', () => {
        const actionType = btn.getAttribute('data-action');
        const target = btn.getAttribute('data-target');
        handleActionClick(actionType, target);
      });
    });

    scrollToBottom();
  }

  function createTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'ai-message assistant';
    indicator.innerHTML = `
      <div class="ai-bubble">
        <div class="ai-typing-indicator">
          <span class="ai-dot"></span>
          <span class="ai-dot"></span>
          <span class="ai-dot"></span>
        </div>
      </div>
    `;
    return indicator;
  }

  function scrollToBottom() {
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function handleActionClick(type, target) {
    if (type === 'scroll') {
      const element = document.querySelector(target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        showToast(`Navigated to ${target}`);
      }
    } else if (type === 'modal') {
      openModal(target);
    } else if (type === 'link') {
      window.open(target, '_blank');
    } else if (type === 'email') {
      window.location.href = `mailto:${target}`;
    } else if (type === 'call') {
      window.location.href = `tel:${target}`;
    }
  }

  /* Comprehensive Knowledge Base & Response Generator */
  function generateAIResponse(query) {
    const q = query.toLowerCase();

    // 1. Technical Skills / Stack
    if (q.includes('skill') || q.includes('stack') || q.includes('python') || q.includes('fastapi') || q.includes('yolo') || q.includes('opencv') || q.includes('sql') || q.includes('language') || q.includes('tech')) {
      return {
        html: `
          <p><strong>Varun N Yaligar's Technical Toolkit:</strong></p>
          <ul>
            <li><strong>Languages & DBs:</strong> Python 3.x, SQL (MySQL, SQLite), C, C++</li>
            <li><strong>AI & Computer Vision:</strong> OpenCV, YOLOv8, NumPy, IoT Sensors</li>
            <li><strong>Web & Backend:</strong> FastAPI, Streamlit, HTML5, CSS3, Figma</li>
            <li><strong>Developer Tools:</strong> Git, GitHub, VS Code</li>
          </ul>
        `,
        actions: [
          { label: '🛠️ View Skills Section', type: 'scroll', target: '#skills' },
          { label: '📄 Read Full Resume', type: 'modal', target: 'modal-resume' }
        ]
      };
    }

    // 2. Notes-to-Story AI Video Generator
    if (q.includes('notes') || q.includes('story') || q.includes('video') || q.includes('animation') || q.includes('tts') || q.includes('converter')) {
      return {
        html: `
          <p>🎬 <strong>Notes-to-Story: Educational AI Video Generator</strong></p>
          <p>An end-to-end AI pipeline converting text & document notes into animated educational videos with character narrations and automated quizzes.</p>
          <ul>
            <li><strong>Document Processing:</strong> Ingests DOCX/PDF notes and parses structured story scripts</li>
            <li><strong>Video & Audio Pipeline:</strong> Async video scene composition using MoviePy, OpenCV & TTS voice synthesis</li>
            <li><strong>State Machine:</strong> Asynchronous job tracking with SQLite state database</li>
          </ul>
        `,
        actions: [
          { label: '💻 Read Pipeline Code', type: 'modal', target: 'modal-notes-to-story' },
          { label: '🚀 View Projects Grid', type: 'scroll', target: '#projects' }
        ]
      };
    }

    // 3. Elephant Detection Project
    if (q.includes('elephant') || q.includes('wildlife') || q.includes('siren') || q.includes('detector') || q.includes('warning')) {
      return {
        html: `
          <p>🐘 <strong>Elephant Detection System using IoT Sensors</strong></p>
          <p>A computer vision wildlife detection system built to protect rural and forest borders from human–elephant conflict.</p>
          <ul>
            <li><strong>Model:</strong> Custom fine-tuned YOLOv8 object detector</li>
            <li><strong>Video Feed:</strong> Real-time processing via OpenCV</li>
            <li><strong>Telemetry:</strong> Dispatches instant alert payloads to IoT sirens and forest ranger endpoints</li>
          </ul>
        `,
        actions: [
          { label: '💻 Read Architecture & Code', type: 'modal', target: 'modal-elephant' },
          { label: '🚀 View Projects Grid', type: 'scroll', target: '#projects' }
        ]
      };
    }

    // 4. Airline Management System
    if (q.includes('airline') || q.includes('flight') || q.includes('booking') || q.includes('sqlite') || q.includes('streamlit')) {
      return {
        html: `
          <p>🛫 <strong>Airline Management System</strong></p>
          <p>Varun's 4th Semester mini-project built to manage flight schedules, passenger bookings, and database operations.</p>
          <ul>
            <li><strong>Frontend:</strong> Streamlit interactive web dashboard</li>
            <li><strong>Database:</strong> SQLite relational schema with full CRUD operations</li>
          </ul>
        `,
        actions: [
          { label: '🗄️ Read DB Schema & Code', type: 'modal', target: 'modal-airline' }
        ]
      };
    }

    // 5. Projects General
    if (q.includes('project') || q.includes('work') || q.includes('built') || q.includes('app') || q.includes('portfolio')) {
      return {
        html: `
          <p><strong>Varun's Featured Projects:</strong></p>
          <ol>
            <li><strong>Notes-to-Story AI Video Generator:</strong> Docx/PDF to Animated Educational Video Pipeline</li>
            <li><strong>Elephant Detection System:</strong> Custom YOLOv8 + OpenCV + IoT Siren Telemetry</li>
            <li><strong>Airline Management System:</strong> Streamlit + SQLite3 relational database</li>
            <li><strong>FastAPI AI Microservice:</strong> Async REST API for image inference payloads</li>
          </ol>
        `,
        actions: [
          { label: '🚀 Scroll to Projects', type: 'scroll', target: '#projects' },
          { label: '🎬 Notes-to-Story Code', type: 'modal', target: 'modal-notes-to-story' },
          { label: '🐘 Elephant Code', type: 'modal', target: 'modal-elephant' },
          { label: '⚡ FastAPI Code', type: 'modal', target: 'modal-fastapi' }
        ]
      };
    }

    // 5. Education & CGPA
    if (q.includes('education') || q.includes('cgpa') || q.includes('college') || q.includes('gpa') || q.includes('score') || q.includes('school') || q.includes('study') || q.includes('alva') || q.includes('moodbidri')) {
      return {
        html: `
          <p>🎓 <strong>Varun's Educational Background:</strong></p>
          <ul>
            <li><strong>B.E. in AIML:</strong> Alva’s Institute of Engineering & Technology, Moodbidri (2023–Present, <strong>CGPA: 7.7</strong>)</li>
            <li><strong>PU (Science - PCMB):</strong> ICS Mahesh PU College, Dharwad (2021–2023, <strong>75%</strong>)</li>
            <li><strong>SSLC (Class 10):</strong> Sports School, Chandargi (2011–2021, <strong>90% Distinction</strong>)</li>
          </ul>
        `,
        actions: [
          { label: '📖 Read About Me', type: 'scroll', target: '#about' },
          { label: '📄 Open Resume Modal', type: 'modal', target: 'modal-resume' }
        ]
      };
    }

    // 6. Contact, Hiring, Email & Location
    if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('mobile') || q.includes('hire') || q.includes('location') || q.includes('address') || q.includes('reach') || q.includes('internship') || q.includes('job')) {
      return {
        html: `
          <p>📬 <strong>Get in Touch with Varun N Yaligar:</strong></p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:varunyaligar1@gmail.com">varunyaligar1@gmail.com</a></li>
            <li><strong>Phone:</strong> <a href="tel:+918660070504">+91 8660070504</a></li>
            <li><strong>Location:</strong> Moodbidri / Dharwad, Karnataka, India</li>
            <li><strong>Status:</strong> Open for AIML & Software Development Internships/Roles</li>
          </ul>
        `,
        actions: [
          { label: '📧 Send Email', type: 'email', target: 'varunyaligar1@gmail.com' },
          { label: '📞 Call Varun', type: 'call', target: '+918660070504' },
          { label: '✍️ Fill Contact Form', type: 'scroll', target: '#contact' }
        ]
      };
    }

    // 7. Certifications
    if (q.includes('certif') || q.includes('nptel') || q.includes('google') || q.includes('genai') || q.includes('achievement') || q.includes('course')) {
      return {
        html: `
          <p>🏆 <strong>Varun's Certifications & Achievements:</strong></p>
          <ul>
            <li><strong>Google Cloud Generative AI Leader Track:</strong> GenAI models, LLM architectures & Cloud AI</li>
            <li><strong>NPTEL Internet of Things (IoT):</strong> Hardware telemetry & sensor protocols</li>
          </ul>
        `,
        actions: [
          { label: '🏆 View Certifications', type: 'scroll', target: '#achievements' }
        ]
      };
    }

    // 8. Passions, Sports & Dollu Kunitha
    if (q.includes('passion') || q.includes('sport') || q.includes('dance') || q.includes('dollu') || q.includes('kunitha') || q.includes('hobby') || q.includes('cultural')) {
      return {
        html: `
          <p>🥁 <strong>Passions Beyond Engineering:</strong></p>
          <ul>
            <li><strong>Sports School Athletics Alumnus:</strong> 10 years at Sports School, Chandargi — built strong discipline, sportsmanship, and endurance.</li>
            <li><strong>Dollu Kunitha Folk Artist:</strong> Performer of Dollu Kunitha — Karnataka's vibrant, high-energy traditional drum folk dance form.</li>
          </ul>
        `,
        actions: [
          { label: '🥁 View Passions Section', type: 'scroll', target: '#interests' }
        ]
      };
    }

    // 9. Resume
    if (q.includes('resume') || q.includes('cv') || q.includes('download') || q.includes('print')) {
      return {
        html: `
          <p>📄 You can read and print Varun's full Curriculum Vitae directly on the portfolio!</p>
        `,
        actions: [
          { label: '📄 Open Printable Resume', type: 'modal', target: 'modal-resume' }
        ]
      };
    }

    // 10. Greetings & Friendly Chatter
    if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('namaste') || q.includes('who are you') || q.includes('varun')) {
      return {
        html: `
          <p>Hello! I am Varun's AI Portfolio Assistant. Varun N Yaligar is an AIML undergraduate at AIET Moodbidri specializing in Python, Computer Vision (YOLO/OpenCV), and FastAPI backend systems.</p>
          <p>What would you like to know about his projects, skills, or education?</p>
        `,
        actions: [
          { label: '💡 Top Skills', type: 'scroll', target: '#skills' },
          { label: '🚀 View Projects', type: 'scroll', target: '#projects' },
          { label: '📬 Contact Info', type: 'scroll', target: '#contact' }
        ]
      };
    }

    // Default Fallback Response
    return {
      html: `
        <p>I'd be glad to help! You can ask me about:</p>
        <ul>
          <li><strong>"What projects has Varun built?"</strong></li>
          <li><strong>"What is his CGPA & college?"</strong></li>
          <li><strong>"What programming languages does he know?"</strong></li>
          <li><strong>"How can I contact Varun?"</strong></li>
        </ul>
      `,
      actions: [
        { label: '🐘 Elephant Project', type: 'modal', target: 'modal-elephant' },
        { label: '📬 Contact Varun', type: 'scroll', target: '#contact' },
        { label: '📄 Open Resume', type: 'modal', target: 'modal-resume' }
      ]
    };
  }
}

/* 9. Toast Notification */
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
