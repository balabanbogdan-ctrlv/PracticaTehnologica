// Funcție simplă care verifică poziția scroll-ului
function handleScroll() {
    const backToTopBtn = document.getElementById("backToTop");
    if (!backToTopBtn) return; // Siguranță: dacă butonul nu există, oprim funcția
    
    // Dacă utilizatorul a coborât mai mult de 300px, afișăm butonul, altfel îl ascundem
    if (window.scrollY > 300) {
        backToTopBtn.style.display = "block";
    } else {
        backToTopBtn.style.display = "none";
    }
}

// Ascultător global pentru click-uri
document.addEventListener("click", function (event) {
    const target = event.target;

    // A. Smooth Scroll pentru ancore interne (#despre, #contact etc.)
    const link = target.closest('a[href^="#"]');
    if (link) {
        const targetId = link.getAttribute('href');
        if (targetId !== '#') {
            event.preventDefault(); // Oprim saltul brusc al browserului
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
        return;
    }

    // B. Logica pentru butonul Back to Top
    if (target.closest('#backToTop')) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
    }

    // C. Închidere automată meniu Bootstrap la click în exterior
    const navbarCollapse = document.querySelector(".navbar-collapse");
    const navbarToggler = document.querySelector(".navbar-toggler");

    if (navbarCollapse && navbarToggler && navbarCollapse.classList.contains("show")) {
        const isClickInsideNavbar = navbarCollapse.contains(target) || navbarToggler.contains(target);
        if (!isClickInsideNavbar) {
            navbarToggler.click(); // Simulăm click pe buton pentru a închide meniul
        }
    }
});

// Declanșăm funcția handleScroll de fiecare dată când utilizatorul mișcă rotița de scroll
window.addEventListener("scroll", handleScroll);

// --- LOGICĂ CORECTĂ PENTRU COUNTER ANIMAT LA SCROLL (IntersectionObserver) ---
document.addEventListener("DOMContentLoaded", function () {
    const counters = document.querySelectorAll(".counter");
    const statsSection = document.getElementById("stats-section");

    if (!statsSection || counters.length === 0) return;

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute("data-target"); // Preluăm numărul țintă (ex: 4500)
            const duration = 2000; // Durata animației în milisecunde (2 secunde)
            const step = target / (duration / 16); // Calculăm incrementul pe fiecare cadru (~60fps)

            let current = 0;

            const updateNumber = () => {
                current += step;
                if (current < target) {
                    counter.innerText = Math.floor(current);
                    requestAnimationFrame(updateNumber); // Asigură o animație fluidă
                } else {
                    counter.innerText = target; // La final setăm valoarea exactă
                }
            };

            updateNumber();
        });
    };

    // Folosim IntersectionObserver pentru a porni animația DOAR când secțiunea apare pe ecran
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(statsSection); // Oprim observarea ca animația să ruleze o singură dată
            }
        });
    }, { threshold: 0.3 }); // Declanșează când 30% din secțiune este vizibilă

    observer.observe(statsSection);
});