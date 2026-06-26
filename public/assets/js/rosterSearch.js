const rosterSearch = document.querySelector("#rosterSearch");
const playerRows = document.querySelectorAll(".player-row");

function normalizeText(text) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

if (rosterSearch) {
    rosterSearch.addEventListener("input", () => {
        const searchValue = normalizeText(rosterSearch.value.trim());

        playerRows.forEach((row) => {
            const playerData = normalizeText(row.dataset.search || "");

            if (playerData.includes(searchValue)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    });
}