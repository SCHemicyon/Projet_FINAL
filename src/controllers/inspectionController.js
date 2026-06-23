import axios from "axios";
import { PrismaClient } from "../../prisma/generated/prisma/client.js";
import { adapter } from "../../prisma/adapter.js";
import { CLASSES } from "../wow/specData.js";

const prisma = new PrismaClient({ adapter })

function getSpecInfo(specId) {
    for (const wowClass of Object.values(CLASSES)) {
        const spec = Object.values(wowClass.specs).find(
            item => Number(item.id) === Number(specId)
        );

        if (spec) {
            return { wowClass, spec };
        }
    }

    return null;
}



function sortPlayers(players, sort, dir) {
    const direction = dir === "asc" ? 1 : -1;

    return players.sort((a, b) => {
        if (sort === "name") {
            return a.name.localeCompare(b.name) * direction;
        }

        if (sort === "ilvl") {
            return (a.ilvl - b.ilvl) * direction;
        }

        if (sort === "set") {
            return (a.setPieces - b.setPieces) * direction;
        }

        if (sort === "mythic") {
            return (a.mythicScore - b.mythicScore) * direction;
        }

        return 0;
    });
}

export async function inspectionPage(req, res) {
    if (!req.session.user) {
        return res.redirect("/");
    }

    const sort = req.query.sort || "ilvl";
    const dir = req.query.dir || "desc";

    const rosters = await prisma.roster.findMany({
        include: {
            players: true
        }
    });

    const selectedRosterId =
        Number(req.query.roster) || rosters[0]?.id || null;

    const selectedRoster = rosters.find(
        roster => Number(roster.id) === Number(selectedRosterId)
    );

    if (!selectedRoster) {
        return res.render("pages/inspection.twig", {
            title: "Inspection",
            rosters,
            selectedRoster: null,
            players: [],
            sort,
            dir
        });
    }

    const players = [];

    for (const rosterPlayer of selectedRoster.players) {
        try {
            const characterName =
                encodeURIComponent(rosterPlayer.name.toLowerCase());

            const realmSlug =
                encodeURIComponent(rosterPlayer.realmSlug);

            const [profileResponse, equipmentResponse, mythicResponse] =
                await Promise.allSettled([
                    axios.get(
                        `https://eu.api.blizzard.com/profile/wow/character/${realmSlug}/${characterName}`,
                        {
                            headers: {
                                Authorization: `Bearer ${req.session.user.token}`
                            },
                            params: {
                                namespace: "profile-eu",
                                locale: "fr_FR"
                            }
                        }
                    ),

                    axios.get(
                        `https://eu.api.blizzard.com/profile/wow/character/${realmSlug}/${characterName}/equipment`,
                        {
                            headers: {
                                Authorization: `Bearer ${req.session.user.token}`
                            },
                            params: {
                                namespace: "profile-eu",
                                locale: "fr_FR"
                            }
                        }
                    ),

                    axios.get(
                        `https://eu.api.blizzard.com/profile/wow/character/${realmSlug}/${characterName}/mythic-keystone-profile`,
                        {
                            headers: {
                                Authorization: `Bearer ${req.session.user.token}`
                            },
                            params: {
                                namespace: "profile-eu",
                                locale: "fr_FR"
                            }
                        }
                    )
                ]);

            const profile =
                profileResponse.status === "fulfilled"
                    ? profileResponse.value.data
                    : null;

            const equipment =
                equipmentResponse.status === "fulfilled"
                    ? equipmentResponse.value.data
                    : null;

            const mythic =
                mythicResponse.status === "fulfilled"
                    ? mythicResponse.value.data
                    : null;

            const specInfo =
                getSpecInfo(rosterPlayer.specId);

            const equippedItems =
                equipment?.equipped_items || [];

            const tierItems =
                equippedItems.filter(item => item.set);

            

            players.push({
                name: rosterPlayer.name,
                realmName: rosterPlayer.realmName,

                className:
                    specInfo?.wowClass?.name ||
                    profile?.character_class?.name ||
                    "Inconnu",

                classColor:
                    specInfo?.wowClass?.color ||
                    "#FFFFFF",

                specName:
                    specInfo?.spec?.name ||
                    "Inconnue",

                roleIcon:
                    specInfo?.spec?.role?.icon ||
                    "",

                specIcon:
                    specInfo?.spec?.specIcon ||
                    "",

                ilvl:
                    profile?.equipped_item_level ||
                    0,

                setPieces:
                    tierItems.length,

                

                mythicScore:
                    Math.round(
                        mythic?.current_mythic_rating?.rating || 0
                    )
            });

        } catch (error) {
            console.error(
                `Erreur inspection ${rosterPlayer.name}`,
                error.response?.data || error.message
            );
        }
    }

    res.render("pages/inspection.twig", {
        title: "Inspection",
        rosters,
        selectedRoster,
        players: sortPlayers(players, sort, dir),
        sort,
        dir
    });
}