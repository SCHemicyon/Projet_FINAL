import { Prisma } from "../generated/prisma/client.js";
import bcrypt from "bcrypt";

export const hashPasswordExtension = Prisma.defineExtension({
  name: "hashPassword",
  query: {
    entreprise: {
      create: async ({ args, query }) => {
        try {
          const hash = await bcrypt.hash(args.data.password, 10);
          args.data.password = hash;
          return query(args);
        } catch (error) {
          throw error;
        }
      },
      update: async ({ args, query }) => {
        try {
          // Si le mot de passe est présent dans l'update
          if (args.data.password && args.data.password.trim() !== "") {
            const hash = await bcrypt.hash(args.data.password, 10);
            args.data.password = hash;
          } else {
            // Supprime le champ password pour ne pas écraser si ""
            delete args.data.password;
          }
          return query(args);
        } catch (error) {
          throw error;
        }
      }
    },
    employee: {
      create: async ({ args, query }) => {
        try {
          if (args.data.password) {
            const hash = await bcrypt.hash(args.data.password, 10);
            args.data.password = hash;
          }
          return query(args);
        } catch (error) {
          throw error;
        }
      },
      update: async ({ args, query }) => {
        try {
          
          if (args.data.password && args.data.password.trim() !== "") {
            const hash = await bcrypt.hash(args.data.password, 10);
            args.data.password = hash;
          } else {
            
            delete args.data.password;
          }
          return query(args);
        } catch (error) {
          throw error;
        }
      },
    },
  },
});
