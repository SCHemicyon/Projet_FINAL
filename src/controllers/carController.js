import { PrismaClient } from "../../prisma/generated/prisma/client.js";
import { adapter } from "../../prisma/adapter.js";

const prisma = new PrismaClient({ adapter })


// Ajouter une voiture
export async function addCar(req, res) {
    try {
        const { registration, carModel, transmission, employeeId } = req.body;

        // regex normes plaques avant et apres 2009
        const plateRegex = /^(?:[A-HJ-NP-TV-Z]{2}-\d{3}-[A-HJ-NP-TV-Z]{2}|\d{1,4}\s?[A-Z]{1,3}\s?(?:0[1-9]|[1-8]\d|9[0-5]|97[1-6]|2A|2B))$/i;

        if (!plateRegex.test(registration.trim())) {
            throw { msg: "Format d'immatriculation invalide" };
        }

        
        const registrationInDb = await prisma.car.findUnique({
            where: { registration: registration }
        });
        if (registrationInDb) {
            throw { msg: "Immatriculation déjà enregistrée" };
        }

        // Vérifier si l'employé est déjà attribué, seulement si employeeId est valide
        let parsedEmployeeId = parseInt(employeeId);
        if (isNaN(parsedEmployeeId)) parsedEmployeeId = null;

        if (parsedEmployeeId !== null) {
            const employeeAlreadyAssigned = await prisma.car.findUnique({
                where: { employeeId: parsedEmployeeId }
            });
            if (employeeAlreadyAssigned) {
                throw { msg: "Employé déjà attribué" };
            }
        }

        await prisma.car.create({
            data: {
                registration: registration.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
                carModel: carModel.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
                transmission,
                employeeId: parsedEmployeeId,
                entrepriseId: req.session.user
            }
        });

        res.redirect("/fleet");

    } catch (error) {
        // Récupérer les voitures et les employés pour le rendu même en cas d'erreur
        const cars = await prisma.car.findMany({
            where: { entrepriseId: req.user.id },
            include: { employee: true }
        });

        const employees = await prisma.employee.findMany({
            where: { entrepriseId: req.user.id }
        });

        res.render("pages/fleet.twig", {
            title: "Flotte Auto",
            infos: req.user,
            cars,
            employees,
            error
        });
    }
}


// Edit
export async function editCar(req, res) {
    try {
        const { id } = req.params;
        const { registration, carModel, transmission, employeeId } = req.body;

        // Validation de la plaque
        const plateRegex = /^(?:[A-HJ-NP-TV-Z]{2}-\d{3}-[A-HJ-NP-TV-Z]{2}|\d{1,4}\s?[A-Z]{1,3}\s?(?:0[1-9]|[1-8]\d|9[0-5]|97[1-6]|2A|2B))$/i;
        if (!plateRegex.test(registration.trim())) {
            throw { msg: "Format d'immatriculation invalide" };
        }

        const carId = parseInt(id);
        if (isNaN(carId)) throw { msg: "ID de voiture invalide" };

        // Vérifier si l'immatriculation existe déjà sur une autre voiture
        const registrationInDb = await prisma.car.findFirst({
            where: {
                registration: registration,
                NOT: { id: carId }
            }
        });
        if (registrationInDb) {
            throw { msg: "Immatriculation déjà enregistrée" };
        }

        // Vérifier si l'employé est déjà attribué à une autre voiture
        let parsedEmployeeId = parseInt(employeeId);
        if (isNaN(parsedEmployeeId)) parsedEmployeeId = null;

        if (parsedEmployeeId !== null) {
            const employeeAlreadyAssigned = await prisma.car.findFirst({
                where: {
                    employeeId: parsedEmployeeId,
                    NOT: { id: carId }
                }
            });
            if (employeeAlreadyAssigned) {
                throw { msg: "Employé déjà attribué à une autre voiture" };
            }
        }

        await prisma.car.update({
            where: { id: carId },
            data: {
                registration: registration.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
                carModel: carModel.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
                transmission,
                employeeId: parsedEmployeeId
            }
        });

        res.redirect("/fleet");

    } catch (error) {
        console.error(error);

        // Récupérer les voitures et employés même en cas d'erreur
        const cars = await prisma.car.findMany({
            where: { entrepriseId: req.user.id },
            include: { employee: true }
        });

        const employees = await prisma.employee.findMany({
            where: { entrepriseId: req.user.id }
        });

        res.render("pages/fleet.twig", {
            title: "Flotte Auto",
            infos: req.user,
            cars,
            employees,
            error
        });
    }
}


// Delete
export async function deleteCar(req, res) {
    try {
        const { id } = req.params;

        await prisma.car.delete({
            where: { id: parseInt(id) }
        });

        res.redirect("/fleet");
    } catch (error) {
        console.error(error);
        res.redirect("/fleet");
    }
}
