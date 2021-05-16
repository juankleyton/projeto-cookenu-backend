import { Request, Response } from "express";
import { BaseDatabase } from "../data/BaseDatabase";
import { UserDatabase } from "../data/UserDatabase";
import { Authenticator } from "../services/Authenticator";

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string
        const token = req.headers.authorization as string

        const authenticator = new Authenticator()
        authenticator.getData(token)

        const userDatabase = new UserDatabase()
        const user = await userDatabase.getUserById(id)

        res.status(200).send({
            id: user.id,
            name: user.name,
            email: user.email
        })
    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    } finally {
        BaseDatabase.destroyConnection()
    }
}