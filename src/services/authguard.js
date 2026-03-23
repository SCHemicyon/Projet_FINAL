import { PrismaClient } from "../../prisma/generated/prisma/client.js";
import { adapter } from "../../prisma/adapter.js";
const prisma = new PrismaClient({ adapter })

export async function authguard(req, res, next){
    if(req.session.user){
        try{
            const user = await prisma.entreprise.findUnique({
                select:{
                    id:true,
                    raisonSociale:true,
                    siret:true,
                    headName:true,
                    employees:true,
                    cars:true
                },
                where:{
                    id: req.session.user
                }
            })
            if(user){
                req.user = user
                return next()
            }
            else
                res.redirect("/login?user=entreprise")
        }
        catch(error){
            console.error(error);
            res.redirect("/login?user=entreprise")
        }
    }
    else{
        res.redirect("/login?user=entreprise")
    }
}