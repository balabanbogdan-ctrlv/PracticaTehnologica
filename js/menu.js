// Ascultăm click-urile asincrone pe tot documentul pentru a gestiona pauzele din animație
document.addEventListener("click", async function (event) {
    // Verificăm dacă s-a dat click pe un buton de filtrare din meniu
    const button = event.target.closest(".filter-btn");
    if (!button) return;

    const filterValue = button.getAttribute("data-filter"); // Categoria selectată (ex: "pizza", "all")
    const filterButtons = document.querySelectorAll(".filter-btn");
    const menuItems = document.querySelectorAll(".menu-item");

    // 1. Resetăm stilul vizual al tuturor butoanelor pentru a-l activa doar pe cel curent
    filterButtons.forEach(btn => {
        btn.classList.remove("active", "btn-custom-gold");
        btn.classList.add("btn-custom-outline", "text-dark", "border-secondary");
    });
    button.classList.add("active", "btn-custom-gold");
    button.classList.remove("btn-custom-outline", "text-dark", "border-secondary");

    // 2. Animație Faza 1: Efect de dispariție (Fade out) pe toate produsele
    menuItems.forEach(item => {
        item.style.opacity = "0";
        item.style.transform = "scale(0.9)";
    });

    // Așteptăm 200 de milisecunde asincron ca animația de mai sus să se termine vizual
    await new Promise(resolve => setTimeout(resolve, 200));

    // 3. Animație Faza 2: Afișăm doar produsele din categoria selectată
    menuItems.forEach(item => {
        const itemCategory = item.getAttribute("data-category");

        if (filterValue === "all" || itemCategory === filterValue) {
            item.classList.remove("d-none"); // d-none ascunde elementul (display: none)
            item.classList.add("d-block");  // d-block afișează elementul (display: block)
            
            // Efect de apariție lină (Fade in)
            item.style.opacity = "1";
            item.style.transform = "scale(1)";
        } else {
            // Dacă nu corespunde categoriei, îl ascundem complet
            item.classList.remove("d-block");
            item.classList.add("d-none");
        }
    });
}); 