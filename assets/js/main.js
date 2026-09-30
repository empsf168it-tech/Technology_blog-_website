/**
 * TechPulse - Modern Technology & Lifestyle Blog
 * Interactive JavaScript Engine (ES6+ Vanilla JS)
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. Theme Switcher (Dark / Light Mode)
    // ----------------------------------------------------------------------
    const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
    const storedTheme = localStorage.getItem('techpulse_theme') || 'dark';

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('techpulse_theme', theme);

        themeToggleBtns.forEach(btn => {
            const icon = btn.querySelector('i');
            if (icon) {
                if (theme === 'light') {
                    icon.className = 'bi bi-moon-stars-fill';
                    btn.setAttribute('aria-label', 'Switch to Dark Mode');
                } else {
                    icon.className = 'bi bi-sun-fill';
                    btn.setAttribute('aria-label', 'Switch to Light Mode');
                }
            }
        });
    }

    applyTheme(storedTheme);

    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(nextTheme);
            showToast(`Switched to ${nextTheme.toUpperCase()} mode`);
        });
    });

    // ----------------------------------------------------------------------
    // 2. Mobile Navigation Drawer
    // ----------------------------------------------------------------------
    const mobileToggleBtns = document.querySelectorAll('.mobile-nav-toggle');
    const drawerCloseBtn = document.querySelector('.drawer-close-btn');
    const mobileDrawer = document.querySelector('.mobile-drawer-overlay');
    const mobileBackdrop = document.querySelector('.mobile-drawer-backdrop');

    function openMobileMenu() {
        if (mobileDrawer && mobileBackdrop) {
            mobileDrawer.classList.add('active');
            mobileBackdrop.classList.add('active');
            document.body.classList.add('menu-open');
        }
    }

    function closeMobileMenu() {
        if (mobileDrawer && mobileBackdrop) {
            mobileDrawer.classList.remove('active');
            mobileBackdrop.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }

    mobileToggleBtns.forEach(btn => btn.addEventListener('click', openMobileMenu));
    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeMobileMenu);
    if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileMenu);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileMenu();
    });

    // ----------------------------------------------------------------------
    // 3. Navbar Sticky Effect & Reading Progress Bar
    // ----------------------------------------------------------------------
    const navbar = document.querySelector('.navbar-techpulse');
    const progressBar = document.createElement('div');
    progressBar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,#00f2fe,#ff0080);z-index:9999;width:0%;transition:width 0.1s ease;';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 30) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });

    // ----------------------------------------------------------------------
    // 4. Interactive Bookmarks / Reading List
    // ----------------------------------------------------------------------
    let savedArticles = JSON.parse(localStorage.getItem('techpulse_saved') || '[]');
    const bookmarkCountBadges = document.querySelectorAll('.bookmark-count-badge');

    function updateBookmarkCount() {
        bookmarkCountBadges.forEach(badge => {
            badge.textContent = savedArticles.length;
            badge.style.display = savedArticles.length > 0 ? 'inline-block' : 'none';
        });
    }

    updateBookmarkCount();

    const bookmarkBtns = document.querySelectorAll('.bookmark-btn');
    bookmarkBtns.forEach(btn => {
        const articleId = btn.dataset.articleId || btn.closest('.tech-article-card, .bento-card-main')?.querySelector('.article-title')?.textContent.trim();
        
        if (articleId && savedArticles.includes(articleId)) {
            btn.classList.add('saved');
            const icon = btn.querySelector('i');
            if (icon) icon.className = 'bi bi-bookmark-fill';
        }

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!articleId) return;

            const icon = btn.querySelector('i');
            if (savedArticles.includes(articleId)) {
                savedArticles = savedArticles.filter(id => id !== articleId);
                btn.classList.remove('saved');
                if (icon) icon.className = 'bi bi-bookmark';
                showToast('Removed from Reading List');
            } else {
                savedArticles.push(articleId);
                btn.classList.add('saved');
                if (icon) icon.className = 'bi bi-bookmark-fill';
                showToast('Added to Reading List ✨');
            }
            localStorage.setItem('techpulse_saved', JSON.stringify(savedArticles));
            updateBookmarkCount();
        });
    });

    // ----------------------------------------------------------------------
    // 5. Category Filtering for Articles
    // ----------------------------------------------------------------------
    const filterPills = document.querySelectorAll('.category-pill-btn');
    const articleCards = document.querySelectorAll('.tech-article-card');

    if (filterPills.length > 0 && articleCards.length > 0) {
        filterPills.forEach(pill => {
            pill.addEventListener('click', () => {
                filterPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');

                const selectedCategory = pill.dataset.category;

                articleCards.forEach(card => {
                    const cardCategory = card.dataset.category;
                    if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                        card.parentElement.style.display = 'block';
                    } else {
                        card.parentElement.style.display = 'none';
                    }
                });
            });
        });
    }

    // ----------------------------------------------------------------------
    // 6. Live Search Filter
    // ----------------------------------------------------------------------
    const searchInputs = document.querySelectorAll('.tech-search-input');
    searchInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            articleCards.forEach(card => {
                const title = card.querySelector('.article-title')?.textContent.toLowerCase() || '';
                const excerpt = card.querySelector('.article-excerpt')?.textContent.toLowerCase() || '';
                const category = card.dataset.category?.toLowerCase() || '';

                if (title.includes(query) || excerpt.includes(query) || category.includes(query)) {
                    card.parentElement.style.display = 'block';
                } else {
                    card.parentElement.style.display = 'none';
                }
            });
        });
    });

    // ----------------------------------------------------------------------
    // 7. Newsletter Subscription Handling
    // ----------------------------------------------------------------------
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = form.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                showToast(`Subscribed successfully! Welcome to TechPulse 🚀`);
                emailInput.value = '';
            }
        });
    });

    // ----------------------------------------------------------------------
    // 8. Interactive Toast Notifications
    // ----------------------------------------------------------------------
    function showToast(message) {
        let toast = document.querySelector('.tech-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'tech-toast';
            document.body.appendChild(toast);
        }
        toast.innerHTML = `<i class="bi bi-cpu-fill text-info fs-5"></i><span>${message}</span>`;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    }
    window.showToast = showToast;

    // ----------------------------------------------------------------------
    // 9. Back to Top Button
    // ----------------------------------------------------------------------
    let backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) {
        backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.setAttribute('id', 'backToTop');
        backToTopBtn.setAttribute('aria-label', 'Back to top');
        backToTopBtn.setAttribute('title', 'Back to top');
        backToTopBtn.innerHTML = '<i class="bi bi-chevron-up"></i>';
        document.body.appendChild(backToTopBtn);
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
