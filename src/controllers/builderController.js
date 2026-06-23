import { PrismaClient } from "../../prisma/generated/prisma/client.js";
import { adapter } from "../../prisma/adapter.js";
import { hashPasswordExtension } from "../../prisma/extensions/hashPasswordExtension.js";

import { CLASSES } from "../wow/specData.js";

const prisma = new PrismaClient({ adapter }).$extends(hashPasswordExtension)


export const builder = async (req, res) => {
    const user = req.session.user || null;

    const rosters = await prisma.roster.findMany({
        
    });

    const selectedRosterId = Number(req.query.rosterId) || rosters[0]?.id || null;

    const selectedRoster = selectedRosterId
        ? await prisma.roster.findUnique({
            where: {
                id: selectedRosterId
            }
        })
        : null;

    res.render("pages/builder.twig", {
        title: "Builder",
        classes: CLASSES,
        user,
        rosters,
        selectedRoster
    });
};

export const saveBuilder = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            error: "Utilisateur non connecté"
        });
    }

    const { rosterId, savedBuilderData } = req.body;

    if (!rosterId) {
        return res.status(400).json({
            error: "Aucun roster sélectionné"
        });
    }

    if (
        typeof savedBuilderData !== "string" ||
        savedBuilderData.length > 5000 ||
        savedBuilderData.includes("<") ||
        savedBuilderData.includes(">") ||
        savedBuilderData.includes('"') ||
        savedBuilderData.includes("'")
    ) {
        return res.status(400).json({
            error: "Données invalides"
        });
    }

    await prisma.roster.update({
        where: {
            id: Number(rosterId)
        },
        data: {
            savedBuilderData
        }
    });

    res.json({
        success: true
    });
};