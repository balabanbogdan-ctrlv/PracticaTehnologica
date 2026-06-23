// Funcție simplă pentru închiderea ferestrei pop-up (Lightbox)
function closeLightbox() {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox) return;
    lightbox.style.display = "none"; // Ascundem fundalul întunecat
    document.body.style.overflow = "auto"; // Re-activăm scroll-ul paginii
}

// Ascultător global pentru click-uri în secțiunea Galerie
document.addEventListener("click", function (event) {
    const target = event.target;

    // 1. Logica de filtrare a imaginilor din Galerie
    const filterBtn = target.closest(".gal-filter-btn");
    if (filterBtn) {
        const filterValue = filterBtn.getAttribute("data-gal-filter");
        const filterButtons = document.querySelectorAll(".gal-filter-btn");
        const galleryCells = document.querySelectorAll(".gallery-cell");

        // Schimbăm clasa activă de pe butoane
        filterButtons.forEach(btn => btn.classList.remove("active", "btn-custom-gold"));
        filterBtn.classList.add("active", "btn-custom-gold");

        // Parcurgem pozele și le ascundem pe cele necorespunzătoare
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

    // 2. Deschidere Pop-up (Lightbox) la click pe o imagine
    const clickedImg = target.closest(".gallery-img-container img");
    if (clickedImg) {
        const lightbox = document.getElementById("lightbox");
        const lightboxImg = document.getElementById("lightbox-img");

        if (lightbox && lightboxImg) {
            // Preluăm sursa (src) și descrierea (alt) de la poza mică și o copiem în cea mare
            lightboxImg.setAttribute("src", clickedImg.getAttribute("src"));
            lightboxImg.setAttribute("alt", clickedImg.getAttribute("alt"));
            
            lightbox.style.display = "flex"; // Afișăm pop-up-ul centrat pe ecran
            document.body.style.overflow = "hidden"; // Blocăm scroll-ul pe fundal
        }
        return;
    }

    // 3. Închidere Lightbox la click pe butonul X sau pe fundalul negru din exterior
    if (target.id === "lightbox-close" || target.id === "lightbox") {
        closeLightbox();
    }
});

// Închidere pop-up la apăsarea tastei Escape de pe tastatură
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        closeLightbox();
    }
});