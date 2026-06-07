
// OPTIMISED, STRICT, SAFEGUARDED MAIN ANIMATION & INTERACTION LOGIC

(() => {
  // TEAM HORIZONTAL SCROLL ANIMATION
  const rail = document.getElementById("scrollRail");
  const page2 = document.getElementById("page2");
  const heading = document.getElementById("meetTheTeam");
  if (!rail || !page2) return;

  let scrollDistance = 0;

  function calculateScrollDistance() {
    scrollDistance = Math.max(0, rail.scrollWidth - window.innerWidth);
  }

  function killRelatedTriggers() {
    ScrollTrigger.getAll().forEach(t => {
      if (t && t.trigger === page2) t.kill();
    });
  }

  function animateHeading() {
    if (!heading) return;
    gsap.set(heading, {
      transformOrigin: "center center",
      willChange: "transform,opacity"
    });
    gsap.fromTo(
      heading,
      {
        scale: 0.8,
        y: 50,
        opacity: 0,
        letterSpacing: "0.05em"
      },
      {
        scale: 1,
        y: 0,
        opacity: 1,
        letterSpacing: "0em",
        ease: "power3.out",
        scrollTrigger: {
          trigger: page2,
          start: "top 80%",
          end: "top 40%",
          scrub: 0.6,
          invalidateOnRefresh: true,
          preventOverlaps: true
        }
      }
    );
  }

  function init() {
    calculateScrollDistance();
    killRelatedTriggers();
    gsap.set(rail, { x: 0, force3D: true, willChange: "transform" });
    gsap.to(rail, {
      x: () => -scrollDistance,
      ease: "none",
      scrollTrigger: {
        trigger: page2,
        start: "top top",
        end: () => `+=${scrollDistance}`,
        scrub: 0.6,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        fastScrollEnd: true,
        invalidateOnRefresh: true,
        preventOverlaps: true
      }
    });
    animateHeading();
  }

  window.addEventListener("load", init);
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      calculateScrollDistance();
      ScrollTrigger.refresh();
    }, 120);
  });
})();

// EVENTS CAROUSEL NAVIGATION (HIGHLY GUARDED)
(() => {
  const categoryButtons = document.querySelectorAll('.event-category-btn');
  const carousel = document.getElementById('eventsCarousel');
  const eventItems = document.querySelectorAll('.event-image-item');

  if (!categoryButtons.length || !carousel || !eventItems.length) return;
  const eventGroups = Object.create(null);
  ['wt','dj','hex','ctf'].forEach(k => eventGroups[k] = []);

  eventItems.forEach((item, idx) => {
    const category = item.getAttribute('data-event');
    if (eventGroups[category]) eventGroups[category].push(idx);
  });

  function showEventCategory(category) {
    categoryButtons.forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`[data-category="${category}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    const idxArr = eventGroups[category];
    if (!idxArr || idxArr.length === 0) return;
    const firstIdx = idxArr[0];
    const itemWidth = eventItems[0].offsetWidth + 16;
    const translateX = -firstIdx * itemWidth;
    gsap.to(carousel, {
      x: translateX,
      duration: 0.6,
      ease: "power2.out"
    });
    eventItems.forEach((item, idx) => {
      if (idxArr.includes(idx)) item.classList.add('active');
      else item.classList.remove('active');
    });
  }

  categoryButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const cat = btn.getAttribute('data-category');
      if (cat) showEventCategory(cat);
    });
  });

  // Init: first valid category
  for (let i = 0; i < categoryButtons.length; ++i) {
    const cat = categoryButtons[i].getAttribute('data-category');
    if (cat) { showEventCategory(cat); break; }
  }
})();

// PROJECTS HORIZONTAL SCROLL ANIMATION
(() => {
  const projectsRail = document.getElementById("projectsRail");
  const projectsSection = document.getElementById("page6");
  const projectsHeading = document.getElementById("projectsHeading");
  if (!projectsRail || !projectsSection) return;
  let scrollDistance = 0;

  function calculate() {
    scrollDistance = Math.max(0, projectsRail.scrollWidth - window.innerWidth);
  }
  function killTriggers() {
    ScrollTrigger.getAll().forEach(t => {
      if (t && t.trigger === projectsSection) t.kill();
    });
  }
  function animateHeading() {
    if (!projectsHeading) return;
    gsap.set(projectsHeading, {
      transformOrigin: "center center",
      willChange: "transform,opacity"
    });
    gsap.fromTo(
      projectsHeading,
      {
        scale: 0.8,
        y: 50,
        opacity: 0,
        letterSpacing: "0.05em"
      },
      {
        scale: 1,
        y: 0,
        opacity: 1,
        letterSpacing: "0em",
        ease: "power3.out",
        scrollTrigger: {
          trigger: projectsSection,
          start: "top 80%",
          end: "top 40%",
          scrub: 0.6,
          invalidateOnRefresh: true,
          preventOverlaps: true
        }
      }
    );
  }
  function init() {
    calculate();
    killTriggers();
    gsap.set(projectsRail, { x: 0, force3D: true, willChange: "transform" });
    gsap.to(projectsRail, {
      x: () => -scrollDistance,
      ease: "none",
      scrollTrigger: {
        trigger: projectsSection,
        start: "top top",
        end: () => `+=${scrollDistance}`,
        scrub: 0.6,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        fastScrollEnd: true,
        invalidateOnRefresh: true,
        preventOverlaps: true
      }
    });
    animateHeading();
  }
  window.addEventListener("load", init);
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      calculate();
      ScrollTrigger.refresh();
    }, 120);
  });
})();

// CUSTOM CURSOR (SAFE, PERF-ORIENTED)
(() => {
  if (window.innerWidth < 768) return;
  const cursor = document.getElementById('customCursor');
  if (!cursor) return;
  const cursorDot = cursor.querySelector('.cursor-dot');
  const cursorOutline = cursor.querySelector('.cursor-outline');
  if (!cursorDot || !cursorOutline) return;

  cursor.style.display = 'block';
  let mouseX = 0, mouseY = 0, dotX = 0, dotY = 0, outlineX = 0, outlineY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX || 0;
    mouseY = e.clientY || 0;
  });

  gsap.ticker.add(() => {
    dotX += (mouseX - dotX) * 0.25;
    dotY += (mouseY - dotY) * 0.25;
    outlineX += (mouseX - outlineX) * 0.12;
    outlineY += (mouseY - outlineY) * 0.12;
    gsap.set(cursorDot, { x: dotX, y: dotY });
    gsap.set(cursorOutline, { x: outlineX, y: outlineY });
  });

  const hoverSel = 'a,button,.msft-card,.project-card,.past-event-card,.wall-card,.event-category-btn,.nav-menu-item';
  document.querySelectorAll(hoverSel).forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });

  document.addEventListener('mousedown', () => cursor.classList.add('click'));
  document.addEventListener('mouseup', () => cursor.classList.remove('click'));
})();

// WALL-OF-FAME ANIMATIONS
(() => {
  const wallSection = document.getElementById('page8');
  if (!wallSection) return;
  const wallTitle = document.querySelector('.wall-of-fame-title');
  if (wallTitle) {
    gsap.fromTo(wallTitle, {
      opacity: 0, y: 80, scale: 0.9
    }, {
      opacity: 1, y: 0, scale: 1, duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: wallSection,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });
  }
  document.querySelectorAll('.wall-card').forEach((card, i) => {
    gsap.fromTo(card, {
      opacity: 0, y: 100, rotationX: -20
    }, {
      opacity: 1, y: 0, rotationX: 0,
      duration: 0.8, delay: i * 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });
  });
})();

// PAGE 1 ENHANCED ANIMATIONS
(() => {
  const page1 = document.getElementById('page1');
  if (!page1) return;
  const buildingImage = document.getElementById('buildingImage');
  const buildingBottom = document.querySelector('.page1-building-bottom');
  if (buildingImage && buildingBottom) {
    gsap.fromTo(buildingImage, {
      opacity: 0, y: 50, scale: 0.9
    }, {
      opacity: 0.95, y: 0, scale: 1, duration: 1.5,
      ease: "power3.out",
      scrollTrigger: {
        trigger: buildingBottom,
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });
  }
  const heading = document.querySelector('.page1-heading');
  if (heading) {
    gsap.fromTo(heading, {
      opacity: 0, y: 50, clipPath: "inset(0 100% 0 0)"
    }, {
      opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)", duration: 1.2, delay: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: page1,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });
  }
  document.querySelectorAll('.page1-text').forEach((p, idx) => {
    gsap.fromTo(p, {
      opacity: 0, y: 30, x: -20
    }, {
      opacity: 1, y: 0, x: 0, duration: 0.8, delay: 0.4 + idx * 0.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: page1,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });
  });
  document.querySelectorAll('.social-icon').forEach((icon, idx) => {
    gsap.fromTo(icon, {
      scale: 0, rotation: -180, opacity: 0
    }, {
      scale: 1, rotation: 0, opacity: 0.85, duration: 0.6, delay: 0.8 + idx * 0.1,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: page1,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });
  });
})();

// EVENTS SECTION ENHANCED ANIMATIONS
(() => {
  const section = document.getElementById('page3');
  if (!section) return;
  const t = document.querySelector('.events-title-main');
  if (t) {
    gsap.fromTo(t, {
      opacity: 0, y: 50, scale: 0.8
    }, {
      opacity: 1, y: 0, scale: 1, duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });
  }
  const wrapper = document.querySelector('.events-carousel-wrapper');
  if (wrapper) {
    gsap.fromTo(wrapper, {
      opacity: 0, y: 100, scale: 0.95
    }, {
      opacity: 1, y: 0, scale: 1, duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: section,
        start: "top 75%",
        toggleActions: "play none none none"
      }
    });
  }
  document.querySelectorAll('.event-image-item').forEach((item, idx) => {
    gsap.fromTo(item, {
      opacity: 0, scale: 0.8, rotationY: 15
    }, {
      opacity: 0.6, scale: 1, rotationY: 0, duration: 0.6, delay: idx * 0.05,
      ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top 70%",
        toggleActions: "play none none none"
      }
    });
  });
  document.querySelectorAll('.event-category-btn').forEach((btn, idx) => {
    gsap.fromTo(btn, {
      opacity: 0, scale: 0, y: 30
    }, {
      opacity: 1, scale: 1, y: 0, duration: 0.6, delay: idx * 0.1,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: section,
        start: "top 65%",
        toggleActions: "play none none none"
      }
    });
  });
})();

// AMBASSADOR ANIMATIONS
(() => {
  const sec = document.getElementById('page7');
  if (!sec) return;
  const title = document.querySelector('.ambassador-title');
  if (title) {
    gsap.fromTo(title, {
      opacity: 0, y: 80, scale: 0.9
    }, {
      opacity: 1, y: 0, scale: 1, duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sec,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });
  }
  document.querySelectorAll('.ambassador-feature').forEach((feat, idx) => {
    gsap.fromTo(feat, {
      opacity: 0, y: 50, rotationX: -15
    }, {
      opacity: 1, y: 0, rotationX: 0, duration: 0.8, delay: idx * 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: feat,
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });
  });
  const logo = document.querySelector('.ambassador-logo-large');
  if (logo) {
    gsap.fromTo(logo, {
      scale: 0, rotation: 180
    }, {
      scale: 1, rotation: 0, duration: 1,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: sec,
        start: "top 75%",
        toggleActions: "play none none none"
      }
    });
  }
  document.querySelectorAll('.ambassador-stat').forEach((stat, idx) => {
    gsap.fromTo(stat, {
      opacity: 0, x: 50
    }, {
      opacity: 1, x: 0, duration: 0.8, delay: idx * 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sec,
        start: "top 70%",
        toggleActions: "play none none none"
      }
    });
  });
})();

// ABOUT US ANIMATIONS
(() => {
  const sec = document.getElementById('page4');
  if (!sec) return;
  const title = document.querySelector('.about-title');
  if (title) {
    gsap.fromTo(title, {
      opacity: 0, y: 80, scale: 0.9
    }, {
      opacity: 1, y: 0, scale: 1, duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sec,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });
  }
  document.querySelectorAll('.past-event-card').forEach((card, idx) => {
    gsap.fromTo(card, {
      opacity: 0, y: 100, rotationX: -20
    }, {
      opacity: 1, y: 0, rotationX: 0, duration: 0.8, delay: idx * 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });
  });
  document.querySelectorAll('.about-stat-item').forEach((item, idx) => {
    gsap.fromTo(item, {
      opacity: 0, scale: 0.5
    }, {
      opacity: 1, scale: 1, duration: 0.6, delay: idx * 0.1,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: sec,
        start: "top 70%",
        toggleActions: "play none none none"
      }
    });
  });
})();

// CONTACT SECTION ANIMATIONS
(() => {
  const sec = document.getElementById('page5');
  if (!sec) return;
  const title = document.querySelector('.contact-title');
  if (title) {
    gsap.fromTo(title, {
      opacity: 0, y: 80, scale: 0.9
    }, {
      opacity: 1, y: 0, scale: 1, duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sec,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });
  }
  document.querySelectorAll('.contact-info-item').forEach((item, idx) => {
    gsap.fromTo(item, {
      opacity: 0, x: -50
    }, {
      opacity: 1, x: 0, duration: 0.8, delay: idx * 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sec,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });
  });
  const form = document.querySelector('.contact-form');
  if (form) {
    gsap.fromTo(form, {
      opacity: 0, y: 50, rotationY: 10
    }, {
      opacity: 1, y: 0, rotationY: 0, duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sec,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });
  }
})();

// STAT COUNTER ANIMATION
(() => {
  const stats = document.querySelectorAll('.stat-number');
  stats.forEach(stat => {
    const target = Number(stat.getAttribute('data-target')) || 0;
    stat.textContent = '0';
    ScrollTrigger.create({
      trigger: stat,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to({ v: 0 }, {
          v: target, duration: 2, ease: "power2.out",
          onUpdate: function() {
            stat.textContent = Math.ceil(this.targets()[0].v);
          }
        });
      }
    });
  });
})();

// NAVIGATION MENU GSAP ANIMATIONS
(() => {
  const menuBtn = document.getElementById('menuBtn');
  const navMenu = document.getElementById('navMenu');
  const closeMenu = document.getElementById('closeMenu');
  const menuItems = document.querySelectorAll('.nav-menu-item');
  if (!menuBtn || !navMenu || !closeMenu) return;

  function openMenu() {
    navMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
    gsap.fromTo(navMenu, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" });
    menuItems.forEach((item, idx) =>
      gsap.fromTo(item, { opacity: 0, y: 50, x: -30 }, { opacity: 1, y: 0, x: 0, duration: 0.6, delay: idx * 0.1, ease: "power3.out" })
    );
    gsap.fromTo(closeMenu, { scale: 0, rotation: -180 }, { scale: 1, rotation: 0, duration: 0.5, delay: 0.3, ease: "back.out(1.7)" });
  }
  function closeMenuHandler() {
    gsap.to(navMenu, {
      opacity: 0, duration: 0.3, ease: "power2.in",
      onComplete: () => {
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
    menuItems.forEach(item =>
      gsap.to(item, { opacity: 0, y: 30, x: -20, duration: 0.2, ease: "power2.in" })
    );
    gsap.to(closeMenu, { scale: 0, rotation: 180, duration: 0.3, ease: "power2.in" });
  }
  menuBtn.addEventListener('click', openMenu);
  closeMenu.addEventListener('click', closeMenuHandler);
  navMenu.addEventListener('click', e => { if (e.target === navMenu) closeMenuHandler(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) closeMenuHandler();
  });
})();

// SMOOTH SCROLL TO SECTIONS
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  const navMenu = document.getElementById('navMenu');
  if (navMenu && navMenu.classList.contains('active')) {
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  }
  const nav = document.querySelector('.msft-nav');
  const navHeight = nav ? nav.offsetHeight : 0;
  const sectionTop = section.offsetTop - navHeight;
  window.scrollTo({ top: sectionTop, behavior: 'smooth' });
}

// NAVBAR SCROLL EFFECT
(() => {
  const nav = document.querySelector('.msft-nav');
  if (!nav) return;
  ScrollTrigger.create({
    start: "top -100",
    end: 99999,
    onEnter: () => nav.classList.add('scrolled'),
    onLeaveBack: () => nav.classList.remove('scrolled')
  });
})();

// CONTACT FORM HANDLER
(() => {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const btn = form.querySelector('.contact-submit-btn');
  if (!btn) return;
  const origText = btn.innerHTML;
  form.addEventListener('submit', e => {
    e.preventDefault();
    gsap.to(btn, {
      scale: 0.95, duration: 0.1, yoyo: true, repeat: 1, ease: "power2.inOut",
      onComplete: () => {
        btn.innerHTML = '<span>Message Sent! ✓</span>';
        btn.style.background = '#7fba00';
        setTimeout(() => {
          form.reset();
          btn.innerHTML = origText;
          btn.style.background = '';
        }, 3000);
      }
    });
  });
})();
