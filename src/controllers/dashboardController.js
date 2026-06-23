import axios from "axios";
import { CLASSES } from "../wow/specData.js";

export async function dashboard(req, res) {
    if (!req.session.user) {
        return res.redirect("/");
    }

    try {
        const accountResponse = await axios.get(
            "https://eu.api.blizzard.com/profile/user/wow",
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

        const accounts = accountResponse.data.wow_accounts || [];

        const accountCharacters = accounts.flatMap(account =>
            account.characters || []
        );

        const characters = [];
        const guildMap = new Map();

        for (const character of accountCharacters) {
            try {
                const realmSlug = encodeURIComponent(character.realm.slug);
                const characterName = encodeURIComponent(character.name.toLowerCase());

                const characterResponse = await axios.get(
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
                );

                const fullCharacter = characterResponse.data;

                const classId =
                    Number(
                        fullCharacter.character_class?.id ||
                        fullCharacter.playable_class?.id
                    );
                const matchingClass =
                    Object.values(CLASSES).find(wowClass =>
                        Number(wowClass.id) === classId
                    );

                fullCharacter.classColor =
                    matchingClass?.color || "#FFFFFF";



                if (fullCharacter.guild) {
                    const guildName = fullCharacter.guild.name;
                    const guildRealmName = fullCharacter.guild.realm?.name || "Royaume inconnu";
                    const guildRealmSlug = fullCharacter.guild.realm?.slug || "unknown";

                    const key = `${guildName}-${guildRealmSlug}`;

                    if (!guildMap.has(key)) {
                        guildMap.set(key, {
                            name: guildName,
                            realm: guildRealmName,
                            realmSlug: guildRealmSlug,
                            characters: []
                        });
                    }

                    guildMap.get(key).characters.push(fullCharacter);
                }

                if (fullCharacter.level === 90) {
                    characters.push(fullCharacter);
                }

            } catch (error) {
                if (error.response?.status === 404) {
                    console.warn(
                        `Personnage introuvable ignoré : ${character.name} - ${character.realm.name}`
                    );
                    continue;
                }

                console.error(
                    `Erreur personnage ${character.name}`,
                    error.response?.data || error.message
                );
            }
        }
        req.session.characters = characters;

        req.session.guilds =
            [...guildMap.values()];
        res.render("pages/dashboard.twig", {
            title: "Dashboard",
            user: req.session.user,
            characters,
            guilds: [...guildMap.values()]
        });

    } catch (error) {
        console.error(error.response?.data || error.message);

        res.render("pages/dashboard.twig", {
            title: "Dashboard",
            user: req.session.user,
            characters: [],
            guilds: [],
            error: "Impossible de récupérer les données Battle.net."
        });
    }
}