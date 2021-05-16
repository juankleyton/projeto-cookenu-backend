import dayjs from "dayjs";
import { Request, Response } from "express";
import { BaseDatabase } from "../data/BaseDatabase";
import { UserDatabase } from "../data/UserDatabase";
import { Authenticator } from "../services/Authenticator";

export const userFeed = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization as string

        const authenticator = new Authenticator()
        const authData = authenticator.getData(token)

        const userDatabase = new UserDatabase()
        const feed = await userDatabase.getFeedById(authData.id)

        res.status(200).send({
            recipes: feed.map((recipe: any) => {
                return {
                    id: recipe.id,
                    title: recipe.title,
                    description: recipe.description,
                    createdAt: dayjs(recipe.createdAt).format("DD/MM/YYYY"),
                    userId: recipe.userId,
                    userName: recipe.name
                }
            })
        })

    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    } finally {
        BaseDatabase.destroyConnection()
    }
}