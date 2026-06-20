// Reguli de validare (Expresii Regulate) pentru text
const REGEX_PATTERNS = {
    name: /^[a-zA-ZăâîșțĂÂÎȘȚ\s]{3,50}$/, // Permite doar litere și spații (3-50 caractere)
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Format standard email
    phone: /^(?:\+373|0)[672]\d{7}$/ // Format telefon Republica Moldova
};

// Funcție care colorează câmpurile în verde (corect) sau roșu (greșit)
function validateField(inputElement, regex) {
    if (!inputElement) return true;
    const isValid = regex.test(inputElement.value.trim());
    
    if (isValid) {
        inputElement.classList.remove("is-invalid");
        inputElement.classList.add("is-valid");
        return true;
    } else {
        inputElement.classList.remove("is-valid");
        inputElement.classList.add("is-invalid");
        return false;
    }
}

// --- PASUL 1: Încărcarea datelor din subfolderul proiectului la deschiderea paginii ---
async function incarcaDateleInitiale() {
    // Verificăm dacă browserul are deja o copie a bazei de date în localStorage
    if (!localStorage.getItem("baza_de_date_rezervari")) {
        try {
            // Facem o cerere asincronă pentru a citi fișierul fizic din folderul indicat de tine
            const response = await fetch("baza_de_date/rezervari.json"); 
            const dateDinFisier = await response.json();
            
            // Salvăm aceste date inițiale în memoria persistentă a browserului
            localStorage.setItem("baza_de_date_rezervari", JSON.stringify(dateDinFisier));
        } catch (error) {
            console.log("Fișierul JSON inițial este gol sau calea este incorectă.");
        }
    }
}
// Rulăm funcția imediat ce se încarcă scriptul
incarcaDateleInitiale();


// --- PASUL 2: Gestionarea formularului la trimitere (Submit) ---
document.addEventListener("submit", function (e) {
    const form = e.target;

    if (form.id === "reservationForm") {
        e.preventDefault(); // Oprim reîncărcarea automată a paginii

        const nameInput = document.getElementById("resName");
        const phoneInput = document.getElementById("resPhone");
        const emailInput = document.getElementById("resEmail");

        // Validăm datele introduse în câmpuri
        const isNameValid = validateField(nameInput, REGEX_PATTERNS.name);
        const isPhoneValid = validateField(phoneInput, REGEX_PATTERNS.phone);
        const isEmailValid = validateField(emailInput, REGEX_PATTERNS.email);

        if (isNameValid && isPhoneValid && isEmailValid) {
            
            // Creăm obiectul cu noua rezervare introdusă acum
            const nouaRezervare = {
                nume: nameInput.value.trim(),
                telefon: phoneInput.value.trim(),
                email: emailInput.value.trim(),
                dataSalvarii: new Date().toLocaleDateString()
            };

            // Preluăm baza de date locală din browser (care conține deja datele citite inițial din fișier)
            const dateExistenteText = localStorage.getItem("baza_de_date_rezervari") || "[]";
            const listaRezervari = JSON.parse(dateExistenteText);

            // Adăugăm noua rezervare în listă
            listaRezervari.push(nouaRezervare);

            // Salvăm lista actualizată înapoi în localStorage (FĂRĂ să mai descarce alt fișier)
            localStorage.setItem("baza_de_date_rezervari", JSON.stringify(listaRezervari, null, 2));

            // Arătăm mesajul verde de succes pe ecran
            document.getElementById("formAlertSuccess").classList.remove("d-none");
            form.reset(); // Curățăm formularul
            
            // Eliminăm culorile de validare după 2 secunde
            setTimeout(() => {
                const fields = form.querySelectorAll('.form-control');
                fields.forEach(f => f.classList.remove('is-valid'));
            }, 2000);
        }
    }
});