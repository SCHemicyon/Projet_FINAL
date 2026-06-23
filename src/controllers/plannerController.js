import { PrismaClient } from "../../prisma/generated/prisma/client.js";
import { adapter } from "../../prisma/adapter.js";
import { hashPasswordExtension } from "../../prisma/extensions/hashPasswordExtension.js";

const prisma = new PrismaClient({
    adapter
}).$extends(hashPasswordExtension);

export const planner = async (req, res) => {
    const user = req.session.user || null;

    const rosters = await prisma.roster.findMany({
    });

    const selectedRosterId =
        Number(req.query.rosterId) || rosters[0]?.id || null;

    const selectedRoster = selectedRosterId
        ? await prisma.roster.findUnique({
            where: {
                id: selectedRosterId
            }
        })
        : null;

    res.render("pages/planner.twig", {
        title: "Planner",
        user,
        rosters,
        selectedRoster
    });
};

export const savePlanner = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            error: "Utilisateur non connecté"
        });
    }

    const { rosterId, savedPlannerData } = req.body;

    if (!rosterId) {
        return res.status(400).json({
            error: "Aucune guilde sélectionnée"
        });
    }

    if (
        typeof savedPlannerData !== "string" ||
        savedPlannerData.length > 50000
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
            savedPlannerData
        }
    });

    res.json({
        success: true
    });
};