// Funcție simplă care închide pop-up-ul cu imaginea mărită
function closeLightbox() {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox) return;
    lightbox.style.display = "none"; // Ascundem fundalul negru
    document.body.style.overflow = "auto"; // Permitem din nou scroll-ul în pagină
}

// Ascultător global pentru evenimentele din Galerie
document.addEventListener("click", function (event) {
    const target = event.target;

    // 1. Filtrarea Imaginilor din Galerie
    const filterBtn = target.closest(".gal-filter-btn");
    if (filterBtn) {
        const filterValue = filterBtn.getAttribute("data-gal-filter");
        const filterButtons = document.querySelectorAll(".gal-filter-btn");
        const galleryCells = document.querySelectorAll(".gallery-cell");

        // Resetăm stilul butoanelor de galerie
        filterButtons.forEach(btn => btn.classList.remove("active", "btn-custom-gold"));
        filterBtn.classList.add("active", "btn-custom-gold");

        // Ascundem sau arătăm pozele în funcție de categorie
        galleryCells.forEach(cell => {
            const cellCategory = cell.getAttribute("data-gal-category");
            if (filterValue === "all" || cellCategory === filterValue) {
                cell.classList.remove("d-none");
            } else {
                cell.classList.add("d-none");
            }
        });
        return;
    }

    // 2. Deschidere Pop-up (Lightbox) la click pe o imagine mică
    const clickedImg = target.closest(".gallery-img-container img");
    if (clickedImg) {
        const lightbox = document.getElementById("lightbox");
        const lightboxImg = document.getElementById("lightbox-img");

        if (lightbox && lightboxImg) {
            lightboxImg.setAttribute("src", clickedImg.getAttribute("src")); // Copiem adresa imaginii
            lightboxImg.setAttribute("alt", clickedImg.getAttribute("alt")); // Copiem textul descriptiv
            lightbox.style.display = "flex"; // Afișăm containerul mare pe mijlocul ecranului
            document.body.style.overflow = "hidden"; // Blocăm scroll-ul pe fundal
        }
        return;
    }

    // 3. Închidere Lightbox la click pe butonul X sau pe zona neagră din exterior
    if (target.id === "lightbox-close" || target.id === "lightbox") {
        closeLightbox();
    }
});

// Închidere sigură dacă utilizatorul apasă tasta "Escape" pe tastatură
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        closeLightbox();
    }
});