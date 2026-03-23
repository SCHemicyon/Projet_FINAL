document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input");
    const carCards = document.querySelectorAll(".car-card");

    // Filtrage en temps réel
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();

        carCards.forEach(card => {
            const model = card.querySelector(".car-info h3").textContent.toLowerCase();
            const employee = card.querySelector(".car-info p:nth-of-type(2)").textContent.toLowerCase();
            const registration = card.querySelector(".car-info h3").textContent.toLowerCase();

            if (model.includes(query) || employee.includes(query) || registration.includes(query)) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        });
    });
});
