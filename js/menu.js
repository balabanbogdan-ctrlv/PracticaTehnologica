// Punem un ascultător de click asincron pentru a putea folosi pauze (await) în animație
document.addEventListener("click", async function (event) {
    const button = event.target.closest(".filter-btn");
    if (!button) return; // Dacă nu s-a dat click pe un buton de filtrare, oprim funcția

    const filterValue = button.getAttribute("data-filter");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const menuItems = document.querySelectorAll(".menu-item");

    // 1. Resetăm stilul vizual pentru toate butoanele
    filterButtons.forEach(btn => {
        btn.classList.remove("active", "btn-custom-gold");
        btn.classList.add("btn-custom-outline", "text-dark", "border-secondary");
    });
    // Activăm doar butonul pe care s-a dat click
    button.classList.add("active", "btn-custom-gold");

    // 2. Animație Faza 1: Facem toate produsele semi-transparente (Fade out)
    menuItems.forEach(item => {
        item.style.opacity = "0";
        item.style.transform = "scale(0.9)";
    });

    // Punem o pauză asincronă de 200 de milisecunde pentru a lăsa timp animației de ascundere să se producă
    await new Promise(resolve => setTimeout(resolve, 200));

    // 3. Animație Faza 2: Ascundem din pagină produsele care nu fac parte din categoria selectată
    menuItems.forEach(item => {
        const itemCategory = item.getAttribute("data-category");
        
        if (filterValue === "all" || itemCategory === filterValue) {
            item.classList.remove("d-none"); // d-none = display: none în Bootstrap
            item.classList.add("d-block");
            
            // Le facem să reapară lin (Fade in)
            item.style.opacity = "1";
            item.style.transform = "scale(1)";
        } else {
            item.classList.remove("d-block");
            item.classList.add("d-none");
        }
    });
});