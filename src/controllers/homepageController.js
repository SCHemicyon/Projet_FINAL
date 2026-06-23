import { PrismaClient } from "../../prisma/generated/prisma/client.js";
import { adapter } from "../../prisma/adapter.js";
import { hashPasswordExtension } from "../../prisma/extensions/hashPasswordExtension.js";
import bcrypt from "bcrypt"


const prisma = new PrismaClient({ adapter }).$extends(hashPasswordExtension)

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
