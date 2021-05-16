import { Request, Response } from "express";
import { BaseDatabase } from "../data/BaseDatabase";
import { UserDatabase } from "../data/UserDatabase";
import { Authenticator, ROLE_TYPE } from "../services/Authenticator";
import { HashManager } from "../services/HashManager";

export const login = async (req: Request, res: Response) => {
    try {
        if (!req.body.email || !req.body.password) {
            throw new Error("Informe email e senha.")
        }

        const userData = {
            email: req.body.email,
            password: req.body.password
        }

        const userDatabase = new UserDatabase()
        const user = await userDatabase.getUserByEmail(userData.email)

        const hashManager = new HashManager()
        const validatePassword = await hashManager.compare(userData.password, user.password)

        if(!validatePassword) {
            throw new Error("Usuário e/ou senha incorretos!")
        }

        const authenticator = new Authenticator()
        const token = authenticator.generateToken({id:user.id, email:user.email, role:user.role})

        res.status(200).send({
            message: "Usuário logado com sucesso!",
            token: token
        })
    } catch (error) {
        res.status(400).send({message: error.message})
    } finally{
        BaseDatabase.destroyConnection()
    }
}