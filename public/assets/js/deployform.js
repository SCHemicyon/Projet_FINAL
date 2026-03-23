const toggleBtn = document.getElementById('toggle-form');
const employeeForm = document.getElementById('employee-form');

toggleBtn.addEventListener('click', () => {
    employeeForm.classList.toggle('expanded');
});

document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.employee-card');
        const form = card.querySelector('.employee-edit-form');

        // Toggle affichage du formulaire
        form.style.display = form.style.display === 'block' ? 'none' : 'block';
    });
});