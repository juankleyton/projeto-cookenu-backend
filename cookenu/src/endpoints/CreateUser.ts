import { Request, Response } from "express";
import { BaseDatabase } from "../data/BaseDatabase";
import { UserDatabase } from "../data/UserDatabase";
import { Authenticator, ROLE_TYPE } from "../services/Authenticator";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";

export const createUser = async (req: Request, res: Response) => {
    try {
        if (!req.body.name || !req.body.email || !req.body.password){
            throw new Error("Informe todos os dados!")
        }

        if(req.body.email.indexOf("@") === -1) {
            throw new Error("Email inválido.")
        }

        if (req.body.password.length < 6) {
            throw new Error("A senha precisa ter no mínimo 6 caracteres.")
        }

        const userData = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role
        }

        if(!userData.role) {
            userData.role = ROLE_TYPE.NORMAL
        }
        
        if (userData.role !== ROLE_TYPE.ADMIN && userData.role !== ROLE_TYPE.NORMAL) {
            throw new Error ("Parâmetro ROLE precisa ser NORMAL ou ADMIN!")
        }
        

        const idGenerator = new IdGenerator()
        const newId = idGenerator.generateId()

        const hashManager = new HashManager()
        const cypherPassword = await hashManager.hash(userData.password)

        const userDatabase = new UserDatabase()
        await userDatabase.createUser(newId, userData.name, userData.email, cypherPassword, userData.role)

        const authenticator = new Authenticator()
        const token = authenticator.generateToken({
            id: newId,
            email: userData.email,
            role: userData.role
        })

        res.status(200).send({
            message: "Usuário cadastrado com sucesso!",
            token: token
        })
    } catch (error) {
        res.status(400).send({message: error.message})
    } finally {
        BaseDatabase.destroyConnection()
    }
}