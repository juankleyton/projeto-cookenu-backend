import {Request, Response} from 'express'
import { BaseDatabase } from '../data/BaseDatabase'
import { UserDatabase } from '../data/UserDatabase'
import { Authenticator } from '../services/Authenticator'

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization as string
        const id = req.body.id

        const authenticator = new Authenticator()
        const authData = authenticator.getData(token)

        const userDatabase = new UserDatabase()

        if(authData.role !== "ADMIN") {
            throw new Error ("Somente ADMINS tem acesso à esta funcionalidade.")
        }

        await userDatabase.deleteUser(id)

        res.status(200).send({message: "Usuário deletado com sucesso!"})
    } catch (error) {
        res.status(400).send({message: error.message})
    }finally{
        BaseDatabase.destroyConnection()
    }
}