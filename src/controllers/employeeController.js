import { PrismaClient } from "../../prisma/generated/prisma/client.js";
import { adapter } from "../../prisma/adapter.js";
import { hashPasswordExtension } from "../../prisma/extensions/hashPasswordExtension.js";

const prisma = new PrismaClient({ adapter }).$extends(hashPasswordExtension)

export async function addEmployee(req, res) {
    try {
        const { lastName, firstName, mail, password, age, gender } = req.body;

        const siretInDb = await prisma.entreprise.findUnique({
            where: { siret: req.user.siret }
        })
        if (siretInDb) {
            const employeeInDb = await prisma.employee.findUnique({
                where: { mail }
            });
            if (!employeeInDb) {
                const employee = await prisma.employee.create({
                    data: {
                        lastName: lastName.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
                        firstName: firstName.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
                        mail: mail.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
                        password: password.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
                        age: age ? parseInt(age) : null,
                        gender: gender || null,
                        entrepriseId: req.user.id
                    }
                });
                if (employee)
                    res.redirect("/employe")
                else throw { msg: "Un problème est survenu" }
            }
        }
        else {
            throw { msg: "Siret invalide" }
        }

    } catch (error) {
        res.render("pages/employees.twig", {
            error: error,
            title: "Employés"
        })
    }
}

export async function deleteEmployee(req, res){
    try {
        const { id } = req.params;

        await prisma.employee.delete({
            where: { id: parseInt(id) }
        });

        res.redirect("/employe");

    } catch (error) {
         res.render("pages/employees.twig", {
            error: error,
            title: "Employés"
        })
    }
};

export async function editEmployee(req, res) {
  try {
    const { id } = req.params;
    const { firstName, lastName, mail, age, gender, password } = req.body;

    
    const updateData = {
      firstName: firstName.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
      lastName: lastName.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
      mail: mail.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
      age: age ? parseInt(age) : null,
      gender: gender || null,
    };

    // Ajouter le mot de passe uniquement s’il est rempli
    if (password && password.trim() !== "") {
      updateData.password = password; 
    }

   
    await prisma.employee.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    
    res.redirect("/employe");
  } catch (error) {
    console.error(error);

   
    res.render("pages/employe.twig", {
      error: "Impossible de modifier l'employé.",
      title: "Employés",
    });
  }
}