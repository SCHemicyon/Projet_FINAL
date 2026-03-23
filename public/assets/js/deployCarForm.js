document.addEventListener("DOMContentLoaded", () => {
    const editButtons = document.querySelectorAll(".edit-btn");
    const addButton = document.getElementById("toggle-add-form");
    const addForm = document.getElementById("car-add-form");

    // Toggle formulaire de modification par voiture
    editButtons.forEach(button => {
        button.addEventListener("click", () => {
            const carId = button.dataset.id;
            const form = document.getElementById(`edit-form-${carId}`);
            form.style.display = form.style.display === "block" ? "none" : "block";
            if (form.style.display === "block") form.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    // Toggle formulaire d'ajout
    addButton.addEventListener("click", () => {
        addForm.style.display = addForm.style.display === "block" ? "none" : "block";
        if (addForm.style.display === "block") addForm.scrollIntoView({ behavior: "smooth", block: "start" });
    });
});
