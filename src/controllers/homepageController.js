import { PrismaClient } from "../../prisma/generated/prisma/client.js";
import { adapter } from "../../prisma/adapter.js";



const prisma = new PrismaClient({ adapter })

export async function getHomepage(req, res) {
    if (req.session.user) {
        return res.redirect("/dashboard");
    }
    res.render('pages/homepage.twig',
        {
            title: "RosterForge : Accueil"
        }
    )
}
