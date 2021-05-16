import { Request, Response } from "express";
import { BaseDatabase } from "../data/BaseDatabase";
import { UserDatabase } from "../data/UserDatabase";
import { Authenticator } from "../services/Authenticator";

export const getProfile = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization as string

        const authenticator = new Authenticator()
        const authData = authenticator.getData(token)

        const userDatabase = new UserDatabase()
        const user = await userDatabase.getUserById(authData.id)
        res.status(200).send({
            id: authData.id,
            name: user.name,
            email: authData.email
        })
    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    } finally {
        BaseDatabase.destroyConnection()
    }
}