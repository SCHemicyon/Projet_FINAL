import { PrismaClient } from "../../prisma/generated/prisma/client.js";
import { adapter } from "../../prisma/adapter.js";
import { hashPasswordExtension } from "../../prisma/extensions/hashPasswordExtension.js";
import bcrypt from "bcrypt"


const prisma = new PrismaClient({ adapter }).$extends(hashPasswordExtension)

export async function getRegister(req, res) {
    res.render('pages/register.twig',
        {
            title: "Inscription"
        }
    )
}

export async function postRegister(req, res) {
    try {
        const { raisonSociale, siret, password, confirmPassword, headName } = req.body;
        const regex = /^\d{14}$/;

        const siretInDb = await prisma.entreprise.findUnique({
            where: { siret: siret }
        })
        if (!siretInDb) {
            if (regex.test(siret)) {
                if (password == confirmPassword) {
                    const entreprise = await prisma.entreprise.create({
                        data: {
                            raisonSociale: raisonSociale.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
                            siret: siret.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
                            password: password.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
                            headName: headName.replace(/</g, "&lt;").replace(/>/g, "&gt;")
                        }
                    })
                    if (entreprise)
                        res.redirect("/login?user=entreprise")
                    else throw { msg: "Un problème est survenu" }
                }
                else {
                    throw { msg: "Les mots de passe ne correspondent pas" }
                }
            }
            else {
                throw { msg: "Siret invalide" }
            }
        }
        else throw { msg: "Ce siret existe déjà" }
    } catch (error) {
        res.render("pages/register.twig", {
            error: error,
            title: "Inscription"
        })
    }
}

export async function getLogin(req, res) {

    res.render('pages/login.twig',
        {
            title: "Connexion",
            user: req.query.user
        }
    )
}
export async function postLogin(req, res) {
    if (req.query.user == "entreprise") {
        await adminLogin(req, res)
    } else {
        await userLogin(req, res)
    }

}

async function adminLogin(req, res) {
    const siret = req.body.siret
    const password = req.body.password
    try {
        const isInDb = await prisma.entreprise.findUnique({
            where: { siret: siret }
        })
        if (!isInDb) {
            res.render("pages/login.twig", {
                error: { msg: "Identifiants incorrects" },
                title: "Connexion",
                user : req.query.user
            })
        }
        
        
        else {
            if (await bcrypt.compare(password, isInDb.password)) {
                req.session.user = isInDb.id  // req.session.user pour mettre en session
                res.redirect("/home")

            }
            else {
                throw { msg: "Identifiants incorrects" }
            }


        }
    }
    catch (error) {
        
        res.render("pages/login.twig", {
            error: error,
            title: "Connexion",
            user : req.query.user
        })
    }
}

async function userLogin(req, res) {

}

export async function getHome(req, res) {
    try {
        const entrepriseId = req.user.id;

        
        const lastEmployee = await prisma.employee.findFirst({
            where: { entrepriseId },
            include: { car: true },
            orderBy: { id: 'desc' }
        });

        
        const lastCar = await prisma.car.findFirst({
            where: { entrepriseId },
            include: { employee: true },
            orderBy: { id: 'desc' }
        });

        // Totaux pour les graphiques
        const totalEmployees = await prisma.employee.count({ where: { entrepriseId } });
        const employeesWithCar = await prisma.employee.count({
            where: { entrepriseId, car: { isNot: null } }
        });
        const employeesWithoutCar = totalEmployees - employeesWithCar;

        const totalCars = await prisma.car.count({ where: { entrepriseId } });
        const assignedCars = await prisma.car.count({
            where: { entrepriseId, employeeId: { not: null } }
        });
        const unassignedCars = totalCars - assignedCars;

        res.render("pages/home.twig", {
            title: "Tableau de bord",
            infos: req.user,
            lastEmployee,
            lastCar,
            totalEmployees,
            employeesWithCar,
            employeesWithoutCar,
            totalCars,
            assignedCars,
            unassignedCars
        });

    } catch (error) {
        console.error(error);
        res.render("pages/home.twig", {
            title: "Tableau de bord",
            infos: req.user,
            error
        });
    }
}

export async function getEmployees(req, res) {
try {
        const employees = await prisma.employee.findMany({
            where: {
                entrepriseId: req.user.id
            },
            orderBy: {
                lastName: "asc"
            }
        });

        res.render("pages/employees.twig", {
            title: "Employés",
            infos : req.user,
            employees
        });

    } catch (error) {
        res.render("pages/employees.twig", {
            error: error,
            title: "Employés",
            user : req.query.user
        })
    }

    
}

export async function getFleet(req, res) {
    try {
        const cars = await prisma.car.findMany({
            where: { entrepriseId: req.user.id },
             include: { employee: true } // inclut l'employé associé
        });

        const employees = await prisma.employee.findMany({
            where: { entrepriseId: req.user.id }
        });

        res.render("pages/fleet.twig", {
            title: "Flotte Auto",
            infos: req.user,
            cars,
            employees
        });
    } catch (error) {
        res.render("pages/fleet.twig", {
            title: "Flotte Auto",
            infos: req.user,
            error,
            cars: []
        });
    }
}

export async function getSettings(req, res) {
    res.render('pages/settings.twig',
        {
            title: "Paramètres",
            infos: req.user
        }
    )
}

export async function getLogout(req, res) {
    
    req.session.destroy()
    res.redirect("/login?user=entreprise")
}

export async function updateEntreprise(req, res) {
    try {

        const id = parseInt(req.user.id); 
        const { raisonSociale, siret, headName, password } = req.body;
        const siretRegex = /^\d{14}$/;

        
        if (!raisonSociale || !siret) {
            throw { msg: "Raison sociale et SIRET obligatoires" };
        }

        if (!siretRegex.test(siret)) {
            throw { msg: "SIRET invalide" };
        }

        // Vérifier si le SIRET existe déjà pour une autre entreprise
        const existingEntreprise = await prisma.entreprise.findUnique({
            where: { siret }
        });

        if (existingEntreprise && existingEntreprise.id !== id) {
            throw { msg: "SIRET déjà utilisé" };
        }

        
        const updateData = {
            raisonSociale: raisonSociale.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
            siret: siret.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
            headName: headName ? headName.replace(/</g, "&lt;").replace(/>/g, "&gt;") : null
        };

        // Ajouter le mot de passe seulement s'il est fourni
        if (password && password.trim() !== "") {
            updateData.password = password; 
        }

        
        await prisma.entreprise.update({
            where: { id },
            data: updateData
        });

        res.redirect("/settings");
    } catch (error) {
        console.error(error);
        res.render("pages/settings.twig", {
            title: "Paramètres",
            infos: req.user,
            error
        });
    }
}





export async function deleteEntreprise(req, res) {
    try {
        const  id  = parseInt(req.user.id);

        
        await prisma.entreprise.delete({
            where: { id }
        });

        
        req.session.destroy(err => {
            if (err) throw{msg: "Erreur destruction session :"};
            res.redirect("/login");
        });
    } catch (error) {
        
        res.render("pages/settings.twig", {
            title: "Paramètres",
            infos: req.user,
            error
        });
    }
}
