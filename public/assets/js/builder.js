const specButtons = document.querySelectorAll(".spec-button");
const CLASSES = window.CLASSES;

let draggedSlot = null;

const allSlots = () => [...document.querySelectorAll(".slot")];

/* ===================== */
/* AJOUT JOUEUR          */
/* ===================== */

specButtons.forEach(button => {
    button.addEventListener("click", () => {
        const firstEmptySlot = document.querySelector(".slot:not(.filled)");

        if (!firstEmptySlot) {
            alert("Raid complet");
            return;
        }

        createPlayer(firstEmptySlot, {
            classId: button.dataset.classId,
            className: button.dataset.class,
            classColor: button.dataset.classColor,
            specId: button.dataset.specId,
            specName: button.dataset.spec,
            specIcon: button.dataset.specIcon,
            roleName: button.dataset.role,
            roleIcon: button.dataset.roleIcon,
            playerName: button.dataset.class
        });
    });
});

function createPlayer(slot, data) {
    slot.classList.add("filled");

    slot.style.borderColor = data.classColor;

    slot.dataset.classId = data.classId;
    slot.dataset.className = data.className;
    slot.dataset.classColor = data.classColor;
    slot.dataset.specId = data.specId;
    slot.dataset.specName = data.specName;
    slot.dataset.specIcon = data.specIcon;
    slot.dataset.roleName = data.roleName;
    slot.dataset.roleIcon = data.roleIcon;
    slot.dataset.playerName = data.playerName;

    slot.innerHTML = `
        <div class="player-card" draggable="true">
            <img class="role-icon" src="${data.roleIcon}" alt="">
            <img class="spec-icon" src="${data.specIcon}" alt="${data.specName}" title="${data.specName}">
            <span class="player-name">${data.playerName}</span>
            <button class="remove-player" title="Supprimer">×</button>
        </div>
    `;

    bindSlot(slot);
    updateStats();
}

/* ===================== */
/* SLOT EVENTS           */
/* ===================== */

function bindSlot(slot) {
    const player = slot.querySelector(".player-card");
    const removeButton = slot.querySelector(".remove-player");
    const playerName = slot.querySelector(".player-name");

    if (!player) return;

    player.addEventListener("dragstart", () => {
        draggedSlot = slot;
    });

    player.addEventListener("dragend", () => {
        draggedSlot = null;
    });

    if (removeButton) {
        removeButton.addEventListener("click", () => {
            clearSlot(slot);
        });
    }

    slot.addEventListener("contextmenu", e => {
        e.preventDefault();
        clearSlot(slot);
    });

    if (playerName) {
        playerName.addEventListener("dblclick", () => {
            editPlayerName(slot, playerName);
        });
    }
}

function editPlayerName(slot, playerName) {
    const currentName = playerName.textContent.trim();

    const input = document.createElement("input");
    input.classList.add("player-input");
    input.value = currentName;

    playerName.replaceWith(input);

    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);

    const save = () => {
        const span = document.createElement("span");

        span.classList.add("player-name");
        span.textContent = input.value.trim() || currentName;

        slot.dataset.playerName = span.textContent;

        input.replaceWith(span);

        bindSlot(slot);
        updateStats();
    };

    input.addEventListener("blur", save);

    input.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            save();
        }
    });
}

function clearSlot(slot) {
    slot.classList.remove("filled");

    slot.style.borderColor = "#444";

    delete slot.dataset.classId;
    delete slot.dataset.className;
    delete slot.dataset.classColor;
    delete slot.dataset.specId;
    delete slot.dataset.specName;
    delete slot.dataset.specIcon;
    delete slot.dataset.roleName;
    delete slot.dataset.roleIcon;
    delete slot.dataset.playerName;

    slot.innerHTML = "Vide";

    updateStats();
}

/* ===================== */
/* DRAG AND DROP         */
/* ===================== */

allSlots().forEach(slot => {
    slot.addEventListener("dragover", e => {
        e.preventDefault();
    });

    slot.addEventListener("drop", () => {
        if (!draggedSlot || draggedSlot === slot) return;

        swapSlots(draggedSlot, slot);
        rebindAllSlots();
        updateStats();
    });
});

function swapSlots(a, b) {
    const dataA = getSlotData(a);
    const dataB = getSlotData(b);

    if (dataB) {
        createPlayer(a, dataB);
    } else {
        clearSlot(a);
    }

    if (dataA) {
        createPlayer(b, dataA);
    } else {
        clearSlot(b);
    }
}

function rebindAllSlots() {
    document.querySelectorAll(".slot.filled").forEach(slot => {
        bindSlot(slot);
    });
}

function getSlotData(slot) {
    if (!slot.classList.contains("filled")) return null;

    return {
        classId: slot.dataset.classId,
        className: slot.dataset.className,
        classColor: slot.dataset.classColor,
        specId: slot.dataset.specId,
        specName: slot.dataset.specName,
        specIcon: slot.dataset.specIcon,
        roleName: slot.dataset.roleName,
        roleIcon: slot.dataset.roleIcon,
        playerName: slot.dataset.playerName
    };
}

/* ===================== */
/* RECHERCHE DATA        */
/* ===================== */

function findClassByName(className) {
    return Object.values(CLASSES).find(wowClass => wowClass.name === className);
}

function findSpecByName(wowClass, specName) {
    return Object.values(wowClass.specs).find(spec => spec.name === specName);
}

function addSpellsToSet(spells, targetSet) {
    if (!Array.isArray(spells)) return;

    spells.forEach(spell => {
        if (spell && spell.trim()) {
            targetSet.add(spell.trim());
        }
    });
}

function addSpellCategoriesToSets(spells, buffSet, defensiveSet, utilitySet) {
    if (!spells) return;

    addSpellsToSet(spells.buffs, buffSet);
    addSpellsToSet(spells.defensifs, defensiveSet);
    addSpellsToSet(spells.utilitaires, utilitySet);
}

/* ===================== */
/* STATS                 */
/* ===================== */

function updateStats() {
    const slots = document.querySelectorAll(".slot.filled");

    let tanks = 0;
    let heals = 0;
    let mdps = 0;
    let rdps = 0;

    const classCounts = {};

    const activeBuffs = new Set();
    const activeDefensives = new Set();
    const activeUtilities = new Set();

    slots.forEach(slot => {
        const className = slot.dataset.className;
        const specName = slot.dataset.specName;
        const role = slot.dataset.roleName;

        if (role === "Tank") tanks++;
        if (role === "Heal") heals++;
        if (role === "Mélée") mdps++;
        if (role === "Distance") rdps++;

        classCounts[className] = (classCounts[className] || 0) + 1;

        const wowClass = findClassByName(className);

        if (!wowClass) return;

        addSpellCategoriesToSets(
            wowClass.spells,
            activeBuffs,
            activeDefensives,
            activeUtilities
        );

        const spec = findSpecByName(wowClass, specName);

        if (!spec) return;

        addSpellCategoriesToSets(
            spec.spells,
            activeBuffs,
            activeDefensives,
            activeUtilities
        );
    });

    document.getElementById("tank-count").textContent = `Tanks : ${tanks}`;
    document.getElementById("heal-count").textContent = `Heals : ${heals}`;
    document.getElementById("mdps-count").textContent = `Mêlées : ${mdps}`;
    document.getElementById("rdps-count").textContent = `Distances : ${rdps}`;

    updateClassCounts(classCounts);
    updateSpellLists(activeBuffs, activeDefensives, activeUtilities);
    updateShareUrl();
}

function updateClassCounts(classCounts) {
    const classContainer = document.getElementById("class-counts");

    if (!classContainer) return;

    classContainer.innerHTML = "";

    Object.entries(classCounts).sort().forEach(([name, count]) => {
        classContainer.innerHTML += `
            <div>${name} : ${count}</div>
        `;
    });
}

function updateSpellLists(activeBuffs, activeDefensives, activeUtilities) {
    const allBuffs = new Set();
    const allDefensives = new Set();
    const allUtilities = new Set();

    Object.values(CLASSES).forEach(wowClass => {
        addSpellCategoriesToSets(
            wowClass.spells,
            allBuffs,
            allDefensives,
            allUtilities
        );

        Object.values(wowClass.specs).forEach(spec => {
            addSpellCategoriesToSets(
                spec.spells,
                allBuffs,
                allDefensives,
                allUtilities
            );
        });
    });

    renderSpellList("buff-spell-list", allBuffs, activeBuffs);
    renderSpellList("defensive-spell-list", allDefensives, activeDefensives);
    renderSpellList("utility-spell-list", allUtilities, activeUtilities);
}

function renderSpellList(containerId, allSpells, activeSpells) {
    const container = document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = "";

    [...allSpells].sort().forEach(spell => {
        const isActive = activeSpells.has(spell);

        container.innerHTML += `
            <div class="${isActive ? "spell-present" : "spell-missing"}">
                ${spell}
            </div>
        `;
    });
}

/* ===================== */
/* URL SHARE             */
/* ===================== */

function getRaidData() {
    return allSlots().map(slot => {
        const data = getSlotData(slot);

        if (!data) return null;

        return {
            c: data.classId,
            s: data.specId,
            n: data.playerName
        };
    });
}

function updateShareUrl() {
    const raidData = getRaidData();

    const compact = raidData.map(slot => {
        if (!slot) return "";

        return [
            slot.c,
            slot.s,
            encodeURIComponent(slot.n)
        ].join(".");
    }).join("|");

    const url = new URL(window.location.href);

    if (compact.replaceAll("|", "").trim()) {
        url.searchParams.set("raid", compact);
    } else {
        url.searchParams.delete("raid");
    }

    window.history.replaceState(null, "", url);
}

function loadRaidFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const raid = params.get("raid");

    if (!raid) return;

    const entries = raid.split("|");
    const slots = allSlots();

    entries.forEach((entry, index) => {
        if (!entry || !slots[index]) return;

        const [classId, specId, rawName] = entry.split(".");

        const wowClass = Object.values(CLASSES).find(wowClass => {
            return String(wowClass.id) === String(classId);
        });

        if (!wowClass) return;

        const spec = Object.values(wowClass.specs).find(spec => {
            return String(spec.id) === String(specId);
        });

        if (!spec) return;

        createPlayer(slots[index], {
            classId: wowClass.id,
            className: wowClass.name,
            classColor: wowClass.color,
            specId: spec.id,
            specName: spec.name,
            specIcon: spec.specIcon,
            roleName: spec.role.name,
            roleIcon: spec.role.icon,
            playerName: decodeURIComponent(rawName || wowClass.name)
        });
    });

    if (entries.slice(30).some(Boolean)) {
        const extraGroups = document.getElementById("extra-groups");
        const toggleButton = document.getElementById("toggle-extra-groups");

        if (extraGroups && toggleButton) {
            extraGroups.classList.remove("hidden");
            toggleButton.textContent = "- Masquer les groupes";
        }
    }

    updateStats();
}

/* ===================== */
/* PARTAGE               */
/* ===================== */

function addShareButton() {
    const stats = document.querySelector(".raid-stats");

    if (!stats) return;

    const card = document.createElement("div");
    card.classList.add("stats-card");

    card.innerHTML = `
        <h3>Sauver / Partager</h3>
        <button id="copy-share-link" class="share-button">
            Sauvegarder le lien
        </button>
        <div id="share-feedback"></div>
    `;

    stats.prepend(card);

    document.getElementById("copy-share-link").addEventListener("click", async () => {
        updateShareUrl();

        const shareFeedback = document.getElementById("share-feedback");
        const currentUrl = window.location.href;

        try {
            await navigator.clipboard.writeText(currentUrl);
            shareFeedback.textContent = "Lien copié";
        } catch {
            shareFeedback.textContent = currentUrl;
        }

        if (!window.IS_AUTHENTICATED) return;

        const params = new URLSearchParams(window.location.search);
        const savedBuilderData = params.get("raid");

        if (!savedBuilderData) {
            shareFeedback.textContent = "Aucune composition à sauvegarder";
            return;
        }

        try {
            const response = await fetch("/builder/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    rosterId: window.SELECTED_ROSTER_ID,
                    savedBuilderData
                })
            });
        

    shareFeedback.textContent = response.ok
        ? "Lien copié et sauvegardé"
        : "Lien copié, mais sauvegarde impossible";
} catch {
    shareFeedback.textContent = "Lien copié, mais sauvegarde impossible";
}
    });
}

/* ===================== */
/* EXTRA GROUPS          */
/* ===================== */

const toggleButton = document.getElementById("toggle-extra-groups");
const extraGroups = document.getElementById("extra-groups");

if (toggleButton && extraGroups) {
    toggleButton.addEventListener("click", () => {
        extraGroups.classList.toggle("hidden");

        toggleButton.textContent =
            extraGroups.classList.contains("hidden")
                ? "+ Ajouter des groupes"
                : "- Masquer les groupes";
    });
}

/* ===================== */
/* INIT                  */
/* ===================== */
if (
    window.SAVED_BUILDER_DATA &&
    !window.location.search.includes("raid=")
) {
    const url = new URL(window.location.href);

    url.searchParams.set(
        "raid",
        window.SAVED_BUILDER_DATA
    );

    window.history.replaceState(
        null,
        "",
        url
    );
}

addShareButton();
loadRaidFromUrl();
updateStats();