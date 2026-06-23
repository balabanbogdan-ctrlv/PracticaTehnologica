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

    // --- PASUL DE GESTIONARE: Trimitere formular de rezervare prin EmailJS ---
    document.addEventListener("submit", function (e) {
        const form = e.target;

        if (form.id === "reservationForm") {
            e.preventDefault(); // Oprim reîncărcarea automată a paginii

            const nameInput = document.getElementById("resName");
            const phoneInput = document.getElementById("resPhone");
            const emailInput = document.getElementById("resEmail");
            const guestsInput = document.getElementById("resGuests");
            const dateInput = document.getElementById("resDate");
            const timeInput = document.getElementById("resTime");
            const messageInput = document.getElementById("resMessage");

            // Validăm datele introduse în câmpuri
            const isNameValid = validateField(nameInput, REGEX_PATTERNS.name);
            const isPhoneValid = validateField(phoneInput, REGEX_PATTERNS.phone);
            const isEmailValid = validateField(emailInput, REGEX_PATTERNS.email);

            // Validări vizuale rapide pentru restul câmpurilor de tip select/date/time
            let isFormComplete = isNameValid && isPhoneValid && isEmailValid;
            
            if (!guestsInput.value) { guestsInput.classList.add("is-invalid"); isFormComplete = false; } else { guestsInput.classList.remove("is-invalid"); guestsInput.classList.add("is-valid"); }
            if (!dateInput.value) { dateInput.classList.add("is-invalid"); isFormComplete = false; } else { dateInput.classList.remove("is-invalid"); dateInput.classList.add("is-valid"); }
            if (!timeInput.value) { timeInput.classList.add("is-invalid"); isFormComplete = false; } else { timeInput.classList.remove("is-invalid"); timeInput.classList.add("is-valid"); }

            if (isFormComplete) {
                
                // Pregătim parametrii pe care îi vom mapa în șablonul din platforma EmailJS
                const templateParams = {
                    client_name: nameInput.value.trim(),
                    client_phone: phoneInput.value.trim(),
                    client_email: emailInput.value.trim(),
                    reservation_guests: guestsInput.value,
                    reservation_date: dateInput.value,
                    reservation_time: timeInput.value,
                    special_requests: messageInput.value.trim() || "Fără cerințe speciale."
                };

                // Schimbăm starea butonului de trimitere într-un mod interactiv (Loading)
                const submitBtn = form.querySelector("button[type='submit']");
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i> Se trimite...';

                // Expedierea e-mailului folosind librăria SDK EmailJS
                // Înlocuiește "SERVICE_ID" și "TEMPLATE_ID" cu datele din contul tău
                emailjs.send("service_reservation", "template_gir8toz", templateParams)
                    .then(function(response) {
                        console.log('SUCCESS!', response.status, response.text);
                    
                        // Afișăm pe ecran mesajul verde de succes
                        document.getElementById("formAlertSuccess").classList.remove("d-none");
                        form.reset(); // Resetăm toate inputurile formularului
                        
                        // Curățăm clasele vizuale de validare (is-valid) după trimitere
                        const fields = form.querySelectorAll('.form-control, .form-select');
                        fields.forEach(f => {
                            f.classList.remove('is-valid');
                            f.classList.remove('is-invalid');
                        });
                    }, function(error) {
                        console.log('FAILED...', error);
                        alert("Ne pare rău! Sistemul de e-mail a întâmpinat o eroare. Încearcă din nou sau sună-ne direct.");
                    })
                    .finally(function() {
                        // Readucem butonul la forma lui inițială
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                    });
            }
        }

    });   