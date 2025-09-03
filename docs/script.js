// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function () {
  // Initialize tab functionality
  initializeTabs();

  // Initialize copy buttons
  initializeCopyButtons();

  // Initialize navigation
  initializeNavigation();

  // Initialize mobile menu (if needed)
  initializeMobileMenu();
});

// Tab functionality
function initializeTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');

      // Remove active class from all buttons and contents
      tabButtons.forEach((btn) => btn.classList.remove('active'));
      tabContents.forEach((content) => content.classList.remove('active'));

      // Add active class to clicked button and corresponding content
      button.classList.add('active');
      document.getElementById(`${targetTab}-tab`).classList.add('active');
    });
  });
}

// Copy to clipboard functionality
function initializeCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      const textToCopy = button.getAttribute('data-copy');

      if (!textToCopy) {
        // If no data-copy attribute, try to copy from next code block
        const codeBlock = button.closest('.code-block');
        if (codeBlock) {
          const code = codeBlock.querySelector('code');
          if (code) {
            await copyToClipboard(code.textContent.trim());
            showCopyFeedback(button);
          }
        }
      } else {
        await copyToClipboard(textToCopy);
        showCopyFeedback(button);
      }
    });
  });
}

// Copy text to clipboard
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
    }
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
}

// Show copy feedback
function showCopyFeedback(button) {
  const originalContent = button.innerHTML;
  button.innerHTML = '<i class="fas fa-check"></i> Copied!';
  button.style.background = '#28a745';

  setTimeout(() => {
    button.innerHTML = originalContent;
    button.style.background = '';
  }, 2000);
}

// Navigation functionality
function initializeNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          const headerOffset = 100;
          const elementPosition = target.offsetTop;
          const offsetPosition = elementPosition - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }
    });
  });

  // Highlight active navigation item on scroll
  window.addEventListener('scroll', highlightActiveNavItem);
}

// Highlight active navigation item based on scroll position
function highlightActiveNavItem() {
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-link');

  let current = '';
  const scrollPos = window.scrollY + 150;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

// Mobile menu functionality
function initializeMobileMenu() {
  // Create mobile menu button if screen is small
  if (window.innerWidth <= 768) {
    createMobileMenuButton();
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
      createMobileMenuButton();
    } else {
      removeMobileMenuButton();
    }
  });
}

function createMobileMenuButton() {
  if (document.querySelector('.mobile-menu-btn')) return;

  const menuButton = document.createElement('button');
  menuButton.className = 'mobile-menu-btn';
  menuButton.innerHTML = '<i class="fas fa-bars"></i>';
  menuButton.style.cssText = `
        position: fixed;
        top: 1rem;
        left: 1rem;
        z-index: 1001;
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 0.75rem;
        border-radius: 6px;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;

  const sidebar = document.querySelector('.sidebar');
  let isOpen = false;

  menuButton.addEventListener('click', () => {
    if (isOpen) {
      sidebar.style.transform = 'translateX(-100%)';
      menuButton.innerHTML = '<i class="fas fa-bars"></i>';
    } else {
      sidebar.style.transform = 'translateX(0)';
      menuButton.innerHTML = '<i class="fas fa-times"></i>';
    }
    isOpen = !isOpen;
  });

  document.body.appendChild(menuButton);

  // Close menu when clicking on main content
  document.querySelector('.main-content').addEventListener('click', () => {
    if (isOpen) {
      sidebar.style.transform = 'translateX(-100%)';
      menuButton.innerHTML = '<i class="fas fa-bars"></i>';
      isOpen = false;
    }
  });
}

function removeMobileMenuButton() {
  const menuButton = document.querySelector('.mobile-menu-btn');
  if (menuButton) {
    menuButton.remove();
  }

  const sidebar = document.querySelector('.sidebar');
  sidebar.style.transform = '';
}

// Intersection Observer for animations
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
    }
  });
}, observerOptions);

// Observe all cards and sections for animations
document.addEventListener('DOMContentLoaded', () => {
  const animateElements = document.querySelectorAll(
    '.card, .image-card, .trouble-card'
  );
  animateElements.forEach((el) => {
    observer.observe(el);
  });
});

// Add CSS for animations
const animationStyles = `
    .card,
    .image-card,
    .trouble-card {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .mobile-menu-btn {
        transition: all 0.3s ease;
    }
    
    .mobile-menu-btn:hover {
        transform: scale(1.05);
    }
`;

// Inject animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Search functionality (basic implementation)
function initializeSearch() {
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search documentation...';
  searchInput.className = 'search-input';
  searchInput.style.cssText = `
        width: 100%;
        padding: 0.75rem;
        border: 1px solid var(--border-color);
        border-radius: 6px;
        font-size: 0.875rem;
        margin-bottom: 1rem;
    `;

  const sidebar = document.querySelector('.sidebar');
  const searchContainer = document.createElement('div');
  searchContainer.className = 'search-container';
  searchContainer.style.padding = '1rem';
  searchContainer.appendChild(searchInput);

  sidebar.insertBefore(searchContainer, sidebar.querySelector('.sidebar-nav'));

  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach((link) => {
      const text = link.textContent.toLowerCase();
      const listItem = link.parentElement;

      if (text.includes(searchTerm) || searchTerm === '') {
        listItem.style.display = '';
      } else {
        listItem.style.display = 'none';
      }
    });
  });
}

// Initialize search on load
document.addEventListener('DOMContentLoaded', initializeSearch);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + K to focus search
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
      searchInput.focus();
    }
  }

  // Escape to close mobile menu
  if (e.key === 'Escape') {
    const sidebar = document.querySelector('.sidebar');
    const menuButton = document.querySelector('.mobile-menu-btn');
    if (sidebar && menuButton && window.innerWidth <= 768) {
      sidebar.style.transform = 'translateX(-100%)';
      menuButton.innerHTML = '<i class="fas fa-bars"></i>';
    }
  }
});

// Performance optimization: Lazy load code highlighting
let prismLoaded = false;
function loadPrismWhenNeeded() {
  if (!prismLoaded && window.Prism) {
    window.Prism.highlightAll();
    prismLoaded = true;
  }
}

// Load Prism when first code block becomes visible
const codeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      loadPrismWhenNeeded();
      codeObserver.disconnect();
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const firstCodeBlock = document.querySelector('.code-block');
  if (firstCodeBlock) {
    codeObserver.observe(firstCodeBlock);
  }
});

// Print styles optimization
window.addEventListener('beforeprint', () => {
  const sidebar = document.querySelector('.sidebar');
  sidebar.style.display = 'none';
  document.querySelector('.main-content').style.marginLeft = '0';
});

window.addEventListener('afterprint', () => {
  const sidebar = document.querySelector('.sidebar');
  sidebar.style.display = '';
  if (window.innerWidth > 768) {
    document.querySelector('.main-content').style.marginLeft =
      'var(--sidebar-width)';
  }
});
