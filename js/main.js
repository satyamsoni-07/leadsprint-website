/**
 * LeadSprint LLC — Main JavaScript Interactions & Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initAccordion();
  initCounters();
  initDashboardAnimation();
  initContactForm();
  initGsapAnimations();
  initFailsafe();
  initCursorGlow();
  initScrollProgress();
  initMagneticButtons();
  
  // Refresh ScrollTrigger once everything is loaded
  if (document.readyState === 'complete') {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  } else {
    window.addEventListener('load', () => {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    });
  }

  // Refresh on resize and orientation changes
  window.addEventListener('resize', () => {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  });
});

function initFailsafe() {
  // Failsafe: force critical layout elements to be visible after 1.8 seconds in case script loaders fail or stall
  setTimeout(() => {
    document.querySelectorAll('.glass-card, .stat-item, .faq-item, .timeline-item, .timeline-node').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.filter = 'none';
      el.style.visibility = 'visible';
    });
  }, 1800);
}

/* ==========================================================================
   SCROLL PROGRESS BAR & CURSOR GLOW
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.classList.add('scroll-progress-bar');
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
    progressBar.style.width = scrollPercentage + '%';
  }, { passive: true });
}

function initCursorGlow() {
  // Disable cursor glow on touch screens/mobile
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  const glow = document.createElement('div');
  glow.classList.add('cursor-glow');
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;
  let isMoving = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isMoving) {
      glow.style.opacity = '1';
      isMoving = true;
    }
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });

  const tick = () => {
    // Eased lerp movement for premium lag effect
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;

    glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  };
  tick();
}

/* ==========================================================================
   MAGNETIC BUTTON HOVER EFFECT
   ========================================================================== */
function initMagneticButtons() {
  // Disable magnetic animations on mobile/touch screens
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  const buttons = document.querySelectorAll('.btn');

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Magnetic pull scaling: translate buttons towards mouse coordinates slightly
      gsap.to(btn, {
        x: x * 0.22,
        y: y * 0.22,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });

    btn.addEventListener('mouseleave', () => {
      // Re-center button smoothly with elastic snap
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1.1, 0.6)',
        overwrite: 'auto'
      });
    });
  });
}


/* ==========================================================================
   NAVIGATION INTERACTIONS (STICKY HEADER)
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  // Run immediately in case of page refresh
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
}

/* ==========================================================================
   MOBILE NAVIGATION MENU
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.querySelector('.menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

  if (!menuBtn || !mobileNav) return;

  const toggleMenu = () => {
    menuBtn.classList.toggle('active');
    mobileNav.classList.toggle('active');
    // Prevent body scroll when menu is open
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  };

  const closeMenu = () => {
    menuBtn.classList.remove('active');
    mobileNav.classList.remove('active');
    document.body.style.overflow = '';
  };

  menuBtn.addEventListener('click', toggleMenu);
  
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ==========================================================================
   FAQ ACCORDION
   ========================================================================== */
function initAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    
    if (!trigger || !content) return;
    
    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close other open FAQ items
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-content').style.maxHeight = null;
        }
      });
      
      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        content.style.maxHeight = null;
      } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }

      // Refresh ScrollTrigger positions once heights settle (prevents layout alignment jumps below the fold)
      setTimeout(() => {
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
        }
      }, 450);
    });
  });

  // Re-adjust max-heights dynamically on window size shifts
  window.addEventListener('resize', () => {
    faqItems.forEach(item => {
      if (item.classList.contains('active')) {
        const content = item.querySelector('.faq-content');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================================================
   VIEWPORT STATS COUNTER ANIMATION
   ========================================================================== */
function initCounters() {
  const stats = document.querySelectorAll('.stat-number');
  if (stats.length === 0) return;

  const animateValue = (element, start, end, duration, suffix = '') => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentValue = Math.floor(progress * (end - start) + start);
      
      // Add formatting for thousands (e.g. 212)
      if (end >= 1000) {
        element.innerHTML = (currentValue / 1000).toFixed(0) + 'K' + suffix;
      } else {
        element.innerHTML = currentValue + suffix;
      }
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        // Ensure final value is exact
        if (end >= 1000) {
          element.innerHTML = (end / 1000).toFixed(0) + 'K' + suffix;
        } else {
          element.innerHTML = end + suffix;
        }
      }
    };
    window.requestAnimationFrame(step);
  };

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetVal = parseInt(target.getAttribute('data-target'), 10);
        const suffix = target.getAttribute('data-suffix') || '';
        
        animateValue(target, 0, targetVal, 1500, suffix);
        observer.unobserve(target); // Only animate once
      }
    });
  }, observerOptions);

  stats.forEach(stat => observer.observe(stat));
}

/* ==========================================================================
   INTERACTIVE AI DASHBOARD FLOW SIMULATION
   ========================================================================== */
function initDashboardAnimation() {
  const steps = document.querySelectorAll('.flow-step');
  if (steps.length === 0) return;

  let currentStep = 0;
  
  const activateStep = (index) => {
    steps.forEach((step, i) => {
      if (i === index) {
        step.classList.add('active');
        // Simple visual enhancement (scale details)
        step.style.transform = 'scale(1.02)';
      } else {
        step.classList.remove('active');
        step.style.transform = 'scale(1)';
      }
    });
  };

  // Run loop
  activateStep(0);
  setInterval(() => {
    currentStep = (currentStep + 1) % steps.length;
    activateStep(currentStep);
  }, 3500); // Shift every 3.5 seconds
}

/* ==========================================================================
   CONTACT FORM VALIDATION & HANDLING
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('leadsprint-contact');
  const alertBox = document.getElementById('form-alert');
  
  if (!form || !alertBox) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alertBox.style.display = 'none';
    alertBox.className = 'form-alert';

    // Get input values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const instagram = document.getElementById('instagram').value.trim();
    const followers = document.getElementById('followers').value;
    const challenge = document.getElementById('challenge').value.trim();

    // Validations
    if (!name || !email || !instagram || !challenge) {
      showFormAlert('error', 'Please fill in all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFormAlert('error', 'Please enter a valid email address.');
      return;
    }

    if (!instagram.startsWith('@') && instagram.length > 0) {
      showFormAlert('error', 'Instagram handle must start with @.');
      return;
    }

    // Success UI Flow
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner" style="width: 20px; height: 20px; border-width: 2px;"></span> Submitting...';

    const leadData = { name, email, instagram, followers, challenge };
    const endpoint = (window.LEADSPRINT_CONFIG && window.LEADSPRINT_CONFIG.FORM_ENDPOINT) || '';

    if (endpoint) {
      // POST data to real backend (Formspree, Supabase Webhook, Airtable, etc.)
      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(leadData)
      })
      .then(response => {
        if (response.ok) {
          submitSuccess(leadData, submitBtn, originalText);
        } else {
          throw new Error('Server returned error status');
        }
      })
      .catch(err => {
        console.error('Lead submission error:', err);
        // Fallback: unlock calendar anyway so we don't block bookings on network blips
        showFormAlert('error', 'Database sync delay. Unlocking calendar anyway...');
        setTimeout(() => {
          submitSuccess(leadData, submitBtn, originalText);
        }, 1000);
      });
    } else {
      // Local fallback simulator (saves to localStorage)
      setTimeout(() => {
        const savedLeads = JSON.parse(localStorage.getItem('leadsprint_leads') || '[]');
        savedLeads.push({ ...leadData, timestamp: new Date().toISOString() });
        localStorage.setItem('leadsprint_leads', JSON.stringify(savedLeads));

        submitSuccess(leadData, submitBtn, originalText);
      }, 1200);
    }
  });

  function submitSuccess(leadData, submitBtn, originalText) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
    
    // Call the global unlock method in contact.html
    if (typeof window.unlockCalendlyCalendar === 'function') {
      window.unlockCalendlyCalendar(leadData);
    }
  }

  function showFormAlert(type, message) {
    alertBox.className = `form-alert ${type}`;
    alertBox.innerHTML = message;
    alertBox.style.display = 'block';
  }
}

/* ==========================================================================
   GSAP & SCROLLTRIGGER PREMIUM ANIMATIONS (WITH FALLBACKS)
   ========================================================================== */
function initGsapAnimations() {
  const hasHash = !!window.location.hash;

  // Check if GSAP is loaded
  if (typeof gsap === 'undefined') {
    // Basic CSS Scroll Reveal Fallback
    const revealItems = document.querySelectorAll('.glass-card, .stat-item, .faq-item');
    
    // If loaded with a hash anchor, bypass delays and render immediately
    if (hasHash) {
      revealItems.forEach(item => {
        item.style.opacity = '1';
        item.style.transform = 'none';
        item.style.filter = 'none';
      });
      return;
    }

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'none';
          entry.target.style.filter = 'blur(0)';
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01 });

    revealItems.forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px) scale(0.98)';
      item.style.filter = 'blur(8px)';
      item.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      revealObserver.observe(item);
    });
    return;
  }

  // Register ScrollTrigger plugin if available
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Hero entrance (Fade + Blur + Move)
  gsap.from('.hero-title', {
    y: 30,
    scale: 0.99,
    filter: 'blur(10px)',
    opacity: 0,
    duration: 1.0,
    ease: 'power3.out',
    delay: 0.2,
    overwrite: 'auto'
  });

  gsap.from('.hero-desc', {
    y: 25,
    scale: 0.99,
    filter: 'blur(8px)',
    opacity: 0,
    duration: 1.0,
    ease: 'power3.out',
    delay: 0.4,
    overwrite: 'auto'
  });

  gsap.from('.hero-ctas', {
    y: 20,
    filter: 'blur(6px)',
    opacity: 0,
    duration: 1.0,
    ease: 'power3.out',
    delay: 0.6,
    overwrite: 'auto'
  });

  gsap.from('.hero-visual', {
    scale: 0.97,
    filter: 'blur(10px)',
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out',
    delay: 0.5,
    overwrite: 'auto'
  });

  // Section reveals (cards and features)
  if (typeof ScrollTrigger !== 'undefined') {
    // Staggered reveals for 3 Problem cards in the grid
    gsap.from('.grid-3 .glass-card', {
      scrollTrigger: {
        trigger: '.grid-3',
        start: 'top 85%'
      },
      y: 35,
      scale: 0.98,
      filter: 'blur(10px)',
      opacity: 0,
      stagger: 0.12,
      duration: 1.0,
      ease: 'power3.out',
      overwrite: 'auto'
    });

    // Animate generic glass cards only (exclude timeline, pricing, and problem grids to avoid conflicts)
    gsap.utils.toArray('.glass-card:not(.pricing-card):not(.timeline-card):not(.grid-3 .glass-card)').forEach(card => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 35,
        scale: 0.98,
        filter: 'blur(10px)',
        opacity: 0,
        duration: 1.0,
        ease: 'power3.out',
        overwrite: 'auto'
      });
    });

    // Timeline items reveal
    gsap.utils.toArray('.timeline-item').forEach((item, index) => {
      const node = item.querySelector('.timeline-node');
      const card = item.querySelector('.timeline-card');
      
      gsap.from(node, {
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          onEnter: () => item.classList.add('active'),
          toggleActions: 'play none none none'
        },
        scale: 0.5,
        opacity: 0,
        duration: 0.6,
        ease: 'back.out(1.7)',
        overwrite: 'auto'
      });

      gsap.from(card, {
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        x: index % 2 === 0 ? -30 : 30,
        scale: 0.98,
        filter: 'blur(8px)',
        opacity: 0,
        duration: 0.9,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });

    // Stats staggered reveal
    gsap.from('.stat-item', {
      scrollTrigger: {
        trigger: '.stats-grid',
        start: 'top 85%'
      },
      y: 30,
      filter: 'blur(8px)',
      opacity: 0,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power2.out',
      overwrite: 'auto'
    });

    // Pricing cards staggered reveal
    gsap.from('.pricing-card', {
      scrollTrigger: {
        trigger: '.pricing-grid',
        start: 'top 85%'
      },
      y: 40,
      scale: 0.98,
      filter: 'blur(10px)',
      opacity: 0,
      stagger: 0.15,
      duration: 1.0,
      ease: 'power3.out',
      overwrite: 'auto'
    });

    // FAQ list staggered reveal
    gsap.from('.faq-item', {
      scrollTrigger: {
        trigger: '.faq-container',
        start: 'top 85%'
      },
      y: 25,
      filter: 'blur(6px)',
      opacity: 0,
      stagger: 0.08,
      duration: 0.8,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  }
}
