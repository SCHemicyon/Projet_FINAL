const board = document.getElementById("planner-board");
const mapImage = document.querySelector(".planner-map");
const markersLayer = document.getElementById("planner-markers-layer");
const iconButtons = document.querySelectorAll(".planner-icon-button");
const savePlannerButton = document.getElementById("save-planner");
const saveFeedback = document.getElementById("planner-save-feedback");

let draggedIcon = null;
let draggedMarker = null;

function getCoverData() {
    const boardRect = board.getBoundingClientRect();

    const imageRatio = mapImage.naturalWidth / mapImage.naturalHeight;
    const boardRatio = boardRect.width / boardRect.height;

    let displayedWidth;
    let displayedHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (imageRatio > boardRatio) {
        displayedHeight = boardRect.height;
        displayedWidth = displayedHeight * imageRatio;
        offsetX = (displayedWidth - boardRect.width) / 2;
    } else {
        displayedWidth = boardRect.width;
        displayedHeight = displayedWidth / imageRatio;
        offsetY = (displayedHeight - boardRect.height) / 2;
    }

    return {
        boardRect,
        displayedWidth,
        displayedHeight,
        offsetX,
        offsetY
    };
}

function imagePercentToBoardPosition(xPercent, yPercent) {
    const cover = getCoverData();

    return {
        x: (xPercent / 100) * cover.displayedWidth - cover.offsetX,
        y: (yPercent / 100) * cover.displayedHeight - cover.offsetY
    };
}

function boardPositionToImagePercent(clientX, clientY) {
    const cover = getCoverData();

    const xInBoard = clientX - cover.boardRect.left;
    const yInBoard = clientY - cover.boardRect.top;

    let xPercent = ((xInBoard + cover.offsetX) / cover.displayedWidth) * 100;
    let yPercent = ((yInBoard + cover.offsetY) / cover.displayedHeight) * 100;

    xPercent = Math.max(0, Math.min(xPercent, 100));
    yPercent = Math.max(0, Math.min(yPercent, 100));

    return {
        xPercent,
        yPercent
    };
}

function refreshMarkerPosition(marker) {
    const xPercent = Number(marker.dataset.x);
    const yPercent = Number(marker.dataset.y);

    const position = imagePercentToBoardPosition(xPercent, yPercent);

    marker.style.left = `${position.x}px`;
    marker.style.top = `${position.y}px`;
}

function refreshAllMarkers() {
    document.querySelectorAll(".planner-marker").forEach(marker => {
        refreshMarkerPosition(marker);
    });
}

iconButtons.forEach(button => {
    button.addEventListener("mousedown", event => {
        event.preventDefault();

        draggedIcon = button.dataset.icon;

        const ghost = document.createElement("div");
        ghost.classList.add("planner-drag-ghost");
        ghost.id = "planner-drag-ghost";

        ghost.innerHTML = `<img src="${draggedIcon}" alt="">`;

        document.body.appendChild(ghost);

        moveGhost(event);
    });
});

markersLayer.addEventListener("mousedown", event => {
    const marker = event.target.closest(".planner-marker");

    if (!marker) return;

    event.preventDefault();

    draggedMarker = marker;
});

document.addEventListener("mousemove", event => {
    if (draggedIcon) {
        moveGhost(event);
    }

    if (draggedMarker) {
        moveMarker(draggedMarker, event);
    }
});

document.addEventListener("mouseup", event => {
    if (draggedIcon) {
        const rect = markersLayer.getBoundingClientRect();

        const isInside =
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom;

        if (isInside) {
            const position = boardPositionToImagePercent(event.clientX, event.clientY);

            createMarker(
                draggedIcon,
                position.xPercent,
                position.yPercent
            );
        }

        draggedIcon = null;

        const ghost = document.getElementById("planner-drag-ghost");

        if (ghost) {
            ghost.remove();
        }
    }

    draggedMarker = null;
});

function moveGhost(event) {
    const ghost = document.getElementById("planner-drag-ghost");

    if (!ghost) return;

    ghost.style.left = `${event.clientX}px`;
    ghost.style.top = `${event.clientY}px`;
}

function moveMarker(marker, event) {
    const position = boardPositionToImagePercent(event.clientX, event.clientY);

    marker.dataset.x = position.xPercent;
    marker.dataset.y = position.yPercent;

    refreshMarkerPosition(marker);
}

function createMarker(icon, xPercent, yPercent) {
    const marker = document.createElement("div");

    marker.classList.add("planner-marker");

    marker.dataset.icon = icon;
    marker.dataset.x = xPercent;
    marker.dataset.y = yPercent;

    marker.innerHTML = `<img src="${icon}" alt="">`;

    markersLayer.appendChild(marker);

    refreshMarkerPosition(marker);
}

markersLayer.addEventListener("contextmenu", event => {
    const marker = event.target.closest(".planner-marker");

    if (!marker) return;

    event.preventDefault();
    marker.remove();
});

/* ===================== */
/* SAUVEGARDE / PARTAGE  */
/* ===================== */

function getPlannerData() {
    return [...document.querySelectorAll(".planner-marker")].map(marker => {
        return {
            icon: marker.dataset.icon,
            x: Number(marker.dataset.x),
            y: Number(marker.dataset.y)
        };
    });
}

function updatePlannerUrl() {
    const plannerData = getPlannerData();

    const encodedData = encodeURIComponent(
        JSON.stringify(plannerData)
    );

    const url = new URL(window.location.href);

    if (plannerData.length > 0) {
        url.searchParams.set("planner", encodedData);
    } else {
        url.searchParams.delete("planner");
    }

    window.history.replaceState(null, "", url);

    return encodedData;
}

function loadPlannerFromData(encodedData) {
    if (!encodedData) return;

    let plannerData = [];

    try {
        plannerData = JSON.parse(
            decodeURIComponent(encodedData)
        );
    } catch {
        return;
    }

    if (!Array.isArray(plannerData)) return;

    plannerData.forEach(item => {
        if (!item.icon) return;

        createMarker(
            item.icon,
            Number(item.x),
            Number(item.y)
        );
    });
}

function loadPlannerFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const planner = params.get("planner");

    if (!planner) return;

    loadPlannerFromData(planner);
}

if (
    window.IS_AUTHENTICATED &&
    window.SAVED_PLANNER_DATA &&
    !window.location.search.includes("planner=")
){
    const url = new URL(window.location.href);

    url.searchParams.set(
        "planner",
        window.SAVED_PLANNER_DATA
    );

    window.history.replaceState(null, "", url);
}

if (savePlannerButton) {
    savePlannerButton.addEventListener("click", async () => {
        const savedPlannerData = updatePlannerUrl();
        const currentUrl = window.location.href;

        try {
            await navigator.clipboard.writeText(currentUrl);
            saveFeedback.textContent = "Lien copié";
        } catch {
            saveFeedback.textContent = currentUrl;
        }

        if (!window.IS_AUTHENTICATED) return;

        if (!window.SELECTED_ROSTER_ID) {
            saveFeedback.textContent = "Lien copié, mais aucune guilde sélectionnée";
            return;
        }

        try {
            const response = await fetch("/planner/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    rosterId: window.SELECTED_ROSTER_ID,
                    savedPlannerData
                })
            });

            saveFeedback.textContent = response.ok
                ? "Lien copié et planner sauvegardé"
                : "Lien copié, mais sauvegarde impossible";
        } catch {
            saveFeedback.textContent = "Lien copié, mais sauvegarde impossible";
        }
    });
}

if (mapImage.complete) {
    loadPlannerFromUrl();
    refreshAllMarkers();
} else {
    mapImage.addEventListener("load", () => {
        loadPlannerFromUrl();
        refreshAllMarkers();
    });
}

window.addEventListener("resize", refreshAllMarkers);