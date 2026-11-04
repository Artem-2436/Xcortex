document.addEventListener('DOMContentLoaded', () => {
    // === ЭЛЕМЕНТЫ DOM ===
    const menuBtn = document.getElementById('menu-btn');
    const sideNav = document.getElementById('side-menu');
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettingsBtn = document.getElementById('close-settings-x');
    const saveSettingsBtn = document.getElementById('save-settings');
    
    // Настройки
    const themeSelect = document.getElementById('theme-select');
    const hueSlider = document.getElementById('hue-slider');
    const satSlider = document.getElementById('saturation-slider');
    const root = document.documentElement;
    const body = document.body;

    // === 1. УПРАВЛЕНИЕ БОКОВЫМ МЕНЮ ===
    menuBtn.addEventListener('click', () => {
        sideNav.classList.toggle('active');
    });

    // Глобальная функция закрытия меню (вызывается из HTML onclick)
    window.closeMenu = function() {
        sideNav.classList.remove('active');
    };

    // Закрытие меню при клике вне его области
    document.addEventListener('click', (e) => {
        if (!sideNav.contains(e.target) && !menuBtn.contains(e.target)) {
            sideNav.classList.remove('active');
        }
    });

    // === 2. УПРАВЛЕНИЕ МОДАЛЬНЫМ ОКНОМ НАСТРОЕК ===
    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.remove('hidden');
    });

    const closeModal = () => {
        settingsModal.classList.add('hidden');
    };

    closeSettingsBtn.addEventListener('click', closeModal);
    saveSettingsBtn.addEventListener('click', () => {
        applySettings();
        closeModal();
    });

    // Закрытие по клику на затемненный фон
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            closeModal();
        }
    });

    // === 3. ЛОГИКА ЦВЕТОВ И ТЕМЫ ===
    
    // Функция применения текущих значений слайдеров к CSS переменным
    const updateVisuals = () => {
        const hue = hueSlider.value;
        const sat = satSlider.value;
        
        // Обновляем CSS переменные в :root
        root.style.setProperty('--bg-hue', hue);
        root.style.setProperty('--bg-sat', `${sat}%`);
    };

    // Слушатели событий ползунков (live preview)
    hueSlider.addEventListener('input', updateVisuals);
    satSlider.addEventListener('input', updateVisuals);

    // Применение изменений (сохранение в localStorage)
    const applySettings = () => {
        const theme = themeSelect.value;
        const hue = hueSlider.value;
        const sat = satSlider.value;

        // Сохраняем в LocalStorage
        localStorage.setItem('xcortex_theme_mode', theme);
        localStorage.setItem('xcortex_theme_hue', hue);
        localStorage.setItem('xcortex_theme_sat', sat);

        // Применяем тему к телу
        if (theme === 'light') {
            body.setAttribute('data-theme', 'light');
        } else {
            body.removeAttribute('data-theme');
        }
        
        // Принудительно обновляем визуал
        updateVisuals();
    };

    // === 4. ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ===
    const initSettings = () => {
        const savedHue = localStorage.getItem('xcortex_theme_hue');
        const savedSat = localStorage.getItem('xcortex_theme_sat');
        const savedMode = localStorage.getItem('xcortex_theme_mode');

        if (savedHue) hueSlider.value = savedHue;
        if (savedSat) satSlider.value = savedSat;
        if (savedMode) {
            themeSelect.value = savedMode;
            if (savedMode === 'light') {
                body.setAttribute('data-theme', 'light');
            }
        }

        // Применяем сразу без сохранения заново
        updateVisuals();
    };

    initSettings();

    // === 5. ПЛАВНАЯ ПРОКРУТКА (SMOOTH SCROLL) ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // === 6. АНИМАЦИЯ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ (INTERSECTION OBSERVER) ===
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Опционально: перестать наблюдать после появления для производительности
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // Находим все элементы с классом reveal-on-scroll
    const scrollElements = document.querySelectorAll('.reveal-on-scroll');
    scrollElements.forEach(el => {
        observer.observe(el);
    });
});
