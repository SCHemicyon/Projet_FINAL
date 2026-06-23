import { PrismaClient } from "../../prisma/generated/prisma/client.js";
import { adapter } from "../../prisma/adapter.js";
import { CLASSES } from "../wow/specData.js";

const prisma = new PrismaClient({ adapter })
import axios from "axios";

function getClassById(classId) {
    return Object.values(CLASSES).find(
        wowClass => Number(wowClass.id) === Number(classId)
    );
}

function getSpecById(specId) {
    for (const wowClass of Object.values(CLASSES)) {
        const spec = Object.values(wowClass.specs).find(
            item => Number(item.id) === Number(specId)
        );

        if (spec) {
            return {
                spec,
                wowClass
            };
        }
    }

    return null;
}

function getDefaultSpecFromClassId(classId) {
    const wowClass = getClassById(classId);

    if (!wowClass) {
        return null;
    }

    const firstSpec = Object.values(wowClass.specs)[0];

    return {
        spec: firstSpec,
        wowClass
    };
}

function slugifyGuildName(name) {
    return name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replaceAll(" ", "-")
        .replaceAll("'", "");
}

async function getGuildMembers(req, guild) {
    const guildSlug = slugifyGuildName(guild.name);

    const response = await axios.get(
        `https://eu.api.blizzard.com/data/wow/guild/${guild.realmSlug}/${guildSlug}/roster`,
        {
            headers: {
                Authorization: `Bearer ${req.session.user.token}`
            },
            params: {
                namespace: "profile-eu",
                locale: "fr_FR"
            }
        }
    );

    return response.data.members || [];
}

function formatAvailablePlayer(member) {
    const classId = member.character.playable_class?.id;
    const classInfo = getClassById(classId);
    const defaultSpecInfo = getDefaultSpecFromClassId(classId);

    return {
        id: member.character.id,
        name: member.character.name,
        realmName: member.character.realm.name,
        realmSlug: member.character.realm.slug,
        className: classInfo?.name || "Inconnu",
        classColor: classInfo?.color || "#FFFFFF",
        classIcon: classInfo?.classIcon || "",
        specId: defaultSpecInfo?.spec?.id || null,
        specName: defaultSpecInfo?.spec?.name || "Inconnue",
        specIcon: defaultSpecInfo?.spec?.specIcon || "",
        roleName: defaultSpecInfo?.spec?.role?.name || "Inconnu",
        roleIcon: defaultSpecInfo?.spec?.role?.icon || ""
    };
}

function formatRosterPlayer(player) {
    const specInfo = getSpecById(player.specId);

    return {
        ...player,
        className: specInfo?.wowClass?.name || "Inconnu",
        classColor: specInfo?.wowClass?.color || "#FFFFFF",
        classIcon: specInfo?.wowClass?.classIcon || "",
        specName: specInfo?.spec?.name || "Inconnue",
        specIcon: specInfo?.spec?.specIcon || "",
        roleName: specInfo?.spec?.role?.name || "Inconnu",
        roleIcon: specInfo?.spec?.role?.icon || ""
    };
}

export async function rosterPage(req, res) {
    if (!req.session.user) {
        return res.redirect("/");
    }

    const guilds = req.session.guilds || [];

    const selectedGuildName =
        req.query.guild || guilds[0]?.name || null;

    const selectedGuild =
        guilds.find(guild => guild.name === selectedGuildName);

    if (!selectedGuild) {
        return res.render("pages/roster.twig", {
            title: "Roster",
            guilds,
            selectedGuild: null,
            rosterPlayers: [],
            availablePlayers: [],
            error: req.query.error === "full"
    ? "Le roster est limité à 30 joueurs."
    : null
        });
    }

    let roster = await prisma.roster.findFirst({
        where: {
            guildName: selectedGuild.name,
            realmSlug: selectedGuild.realmSlug
        },
        include: {
            players: true
        }
    });

    if (!roster) {
        roster = await prisma.roster.create({
            data: {
                guildName: selectedGuild.name,
                realmName: selectedGuild.realm,
                realmSlug: selectedGuild.realmSlug
            },
            include: {
                players: true
            }
        });
    }

    let availablePlayers = [];
    let error = null;

    try {
        const members = await getGuildMembers(req, selectedGuild);

        const rosterCharacterIds =
            roster.players.map(player => Number(player.characterId));

        availablePlayers = members
            .filter(member => member.character?.level === 90)
            .filter(member => !rosterCharacterIds.includes(Number(member.character.id)))
            .map(member => formatAvailablePlayer(member));

    } catch (err) {
        console.error(err.response?.data || err.message);
        error = "Impossible de récupérer les membres de cette guilde.";
    }

    res.render("pages/roster.twig", {
        title: "Roster",
        guilds,
        selectedGuild,
        rosterPlayers: roster.players.map(player => formatRosterPlayer(player)),
        availablePlayers,
        error
    });
}

export async function addPlayer(req, res) {
    const {
        guildName,
        realmName,
        realmSlug,
        characterId,
        specId,
        name,
        characterRealmName,
        characterRealmSlug
    } = req.body;

    let roster = await prisma.roster.findFirst({
        where: {
            guildName,
            realmSlug
        }
    });

    if (!roster) {
        roster = await prisma.roster.create({
            data: {
                guildName,
                realmName,
                realmSlug
            }
        });
    }
    const rosterCount = await prisma.rosterPlayer.count({
        where: {
            rosterId: roster.id
        }
    });

    if (rosterCount >= 30) {
        return res.redirect(`/roster?guild=${encodeURIComponent(guildName)}&error=full`);
    }
    const alreadyExists = await prisma.rosterPlayer.findFirst({
        where: {
            rosterId: roster.id,
            characterId: Number(characterId)
        }
    });

    if (!alreadyExists) {
        await prisma.rosterPlayer.create({
            data: {
                rosterId: roster.id,
                characterId: Number(characterId),
                specId: specId ? Number(specId) : null,
                name,
                realmName: characterRealmName,
                realmSlug: characterRealmSlug
            }
        });
    }

    res.redirect(`/roster?guild=${encodeURIComponent(guildName)}`);
}

export async function removePlayer(req, res) {
    const { playerId } = req.body;

    const player = await prisma.rosterPlayer.findUnique({
        where: {
            id: Number(playerId)
        },
        include: {
            roster: true
        }
    });

    if (!player) {
        return res.redirect("/roster");
    }

    const guildName = player.roster.guildName;

    await prisma.rosterPlayer.delete({
        where: {
            id: Number(playerId)
        }
    });

    res.redirect(`/roster?guild=${encodeURIComponent(guildName)}`);
}