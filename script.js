/* ==========================================================================
   PORTFOLIO — MAIN JAVASCRIPT
   ========================================================================== */

'use strict';


/* ==========================================================================
   1. MOBILE NAVIGATION
   ========================================================================== */

const navToggle = document.getElementById('nav-toggle');
const primaryNav = document.getElementById('primary-navigation');
const navLinks = document.querySelectorAll('.nav-link');

/**
 * Close the mobile navigation menu.
 */
function closeMobileNav() {
  if (!navToggle || !primaryNav) return;

  navToggle.setAttribute('aria-expanded', 'false');
  primaryNav.classList.remove('active');

  // Restore page scrolling.
  document.body.style.overflow = '';
}

/**
 * Open the mobile navigation menu.
 */
function openMobileNav() {
  if (!navToggle || !primaryNav) return;

  navToggle.setAttribute('aria-expanded', 'true');
  primaryNav.classList.add('active');

  // Prevent the page behind the menu from scrolling.
  document.body.style.overflow = 'hidden';
}

if (navToggle && primaryNav) {

  // Toggle mobile menu.
  navToggle.addEventListener('click', () => {
    const isExpanded =
      navToggle.getAttribute('aria-expanded') === 'true';

    if (isExpanded) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });


  // Close menu after selecting a navigation link.
  navLinks.forEach((link) => {
    link.addEventListener('click', closeMobileNav);
  });


  // Close menu when Escape is pressed.
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMobileNav();
    }
  });


  // Reset mobile menu when returning to desktop.
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMobileNav();
    }
  });
}


/* ==========================================================================
   2. DARK / LIGHT THEME
   ========================================================================== */

const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = themeToggleBtn?.querySelector('.theme-icon');
const metaThemeColor = document.getElementById('meta-theme-color');

const THEME_KEY = 'banala_venkat_theme';


/**
 * Apply a theme to the website.
 *
 * @param {'light' | 'dark'} theme
 */
function applyTheme(theme) {

  const isLight = theme === 'light';

  document.body.classList.toggle(
    'light-theme',
    isLight
  );


  // Change theme icon.
  if (themeIcon) {
    themeIcon.textContent = isLight ? '☀️' : '🌙';
  }


  // Update browser theme colour.
  if (metaThemeColor) {
    metaThemeColor.setAttribute(
      'content',
      isLight ? '#f9fafb' : '#0b0f19'
    );
  }


  // Accessibility label.
  if (themeToggleBtn) {
    themeToggleBtn.setAttribute(
      'aria-label',
      isLight
        ? 'Switch to dark theme'
        : 'Switch to light theme'
    );
  }
}


/* ==========================================================================
   3. LOAD SAVED / SYSTEM THEME
   ========================================================================== */

let savedTheme = null;

try {
  savedTheme = localStorage.getItem(THEME_KEY);
} catch (error) {
  // The site can still work when localStorage is unavailable.
}


const systemPrefersLight =
  window.matchMedia('(prefers-color-scheme: light)').matches;


const initialTheme =
  savedTheme === 'light' || savedTheme === 'dark'
    ? savedTheme
    : systemPrefersLight
      ? 'light'
      : 'dark';


applyTheme(initialTheme);


/* ==========================================================================
   4. THEME TOGGLE BUTTON
   ========================================================================== */

if (themeToggleBtn) {

  themeToggleBtn.addEventListener('click', () => {

    const isCurrentlyLight =
      document.body.classList.contains('light-theme');


    const nextTheme =
      isCurrentlyLight
        ? 'dark'
        : 'light';


    applyTheme(nextTheme);


    // Save preference.
    try {
      localStorage.setItem(
        THEME_KEY,
        nextTheme
      );
    } catch (error) {
      // Ignore storage errors.
    }

  });

}


/* ==========================================================================
   5. SCROLL PROGRESS BAR
   ========================================================================== */

const scrollProgressBar =
  document.querySelector('.scroll-progress-bar');


/* ==========================================================================
   6. ACTIVE NAVIGATION / SECTION SPY
   ========================================================================== */

const sections =
  document.querySelectorAll('section[id]');

let scrollTicking = false;


/**
 * Update:
 * 1. Scroll progress bar
 * 2. Active navbar link
 */
function updateScrollUI() {

  const documentElement =
    document.documentElement;


  /* ------------------------------------------------------------------------
     Scroll Progress
     ------------------------------------------------------------------------ */

  const totalScroll = Math.max(
    documentElement.scrollHeight -
    documentElement.clientHeight,
    0
  );


  const scrollPercentage =
    totalScroll > 0
      ? Math.min(
          Math.max(
            (window.scrollY / totalScroll) * 100,
            0
          ),
          100
        )
      : 0;


  if (scrollProgressBar) {
    scrollProgressBar.style.width =
      `${scrollPercentage}%`;
  }


  /* ------------------------------------------------------------------------
     Section Spy
     ------------------------------------------------------------------------ */

  // Position below the fixed navigation bar.
  const marker =
    window.scrollY + 140;

  let activeId = '';


  sections.forEach((section) => {

    const sectionTop =
      section.offsetTop;

    const sectionBottom =
      sectionTop + section.offsetHeight;


    if (
      marker >= sectionTop &&
      marker < sectionBottom
    ) {
      activeId = section.id;
    }

  });


  if (activeId) {

    navLinks.forEach((link) => {

      const isActive =
        link.getAttribute('href') ===
        `#${activeId}`;


      link.classList.toggle(
        'active',
        isActive
      );

    });

  }


  scrollTicking = false;
}


/* ==========================================================================
   7. OPTIMIZED SCROLL EVENT
   ========================================================================== */

window.addEventListener(
  'scroll',
  () => {

    if (scrollTicking) return;


    scrollTicking = true;


    window.requestAnimationFrame(
      updateScrollUI
    );

  },
  {
    passive: true
  }
);


/* ==========================================================================
   8. INITIALIZE SCROLL UI
   ========================================================================== */

// Initialize immediately.
updateScrollUI();


// Run again after all assets, including images, finish loading.
// This helps section positions remain accurate after the hero image loads.
window.addEventListener(
  'load',
  updateScrollUI
);


/* ==========================================================================
   9. FADE-IN ANIMATIONS
   ========================================================================== */

const animatedElements =
  document.querySelectorAll(
    [
      '.project-card',
      '.challenge-item',
      '.upcoming-card',
      '.education-card',
      '.goal-card-small',
      '.now-card',
      '.skill-category-box',
      '.timeline-item'
    ].join(', ')
  );


/* ==========================================================================
   10. REDUCED MOTION ACCESSIBILITY
   ========================================================================== */

const reduceMotion =
  window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;


/* ==========================================================================
   11. INTERSECTION OBSERVER
   ========================================================================== */

if (
  'IntersectionObserver' in window &&
  !reduceMotion
) {

  const fadeObserver =
    new IntersectionObserver(

      (entries, observer) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) {
            return;
          }


          entry.target.style.opacity = '1';

          entry.target.style.transform =
            'translateY(0)';


          observer.unobserve(
            entry.target
          );

        });

      },

      {
        root: null,

        rootMargin:
          '0px 0px -5% 0px',

        threshold: 0.1
      }

    );


  animatedElements.forEach((element) => {

    element.style.opacity = '0';

    element.style.transform =
      'translateY(20px)';

    element.style.transition =
      'opacity 0.5s ease-out, transform 0.5s ease-out';


    fadeObserver.observe(
      element
    );

  });

}


/* ==========================================================================
   12. FALLBACK — NO INTERSECTION OBSERVER / REDUCED MOTION
   ========================================================================== */

else {

  animatedElements.forEach((element) => {

    element.style.opacity = '1';

    element.style.transform = 'none';

  });

}