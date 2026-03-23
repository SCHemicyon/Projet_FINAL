const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const employeeCards = document.querySelectorAll(".employee-card");

// Fonction de filtrage
function filterEmployees() {
    const query = searchInput.value.toLowerCase();

    employeeCards.forEach(card => {
        const firstName = card.querySelector(".employee-info h3").textContent.toLowerCase();
        const mail = card.querySelector(".employee-info p:nth-of-type(2)").textContent.toLowerCase();

        if (firstName.includes(query) || mail.includes(query)) {
            card.style.display = "flex"; 
        } else {
            card.style.display = "none";
        }
    });
}

// Filtrage en temps réel
searchInput.addEventListener("input", filterEmployees);


