const inspectionSearch = document.querySelector("#inspectionSearch");
const inspectionRows = document.querySelectorAll(".inspection-row");

function normalizeText(text) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

if (inspectionSearch) {
    inspectionSearch.addEventListener("input", () => {
        const searchValue = normalizeText(inspectionSearch.value.trim());

        inspectionRows.forEach((row) => {
            const rowData = normalizeText(row.dataset.search || "");

            if (rowData.includes(searchValue)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    });
}
