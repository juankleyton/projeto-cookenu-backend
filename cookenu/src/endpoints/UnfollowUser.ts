import { Request, Response } from "express";
import { BaseDatabase } from "../data/BaseDatabase";
import { UserDatabase } from "../data/UserDatabase";
import { Authenticator } from "../services/Authenticator";
import { FollowingDatabase } from "../data/FollowingDatabase";

export const unFollowUser = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization as string

        if (!req.body.userToUnFollowId && req.body.userToUnFollowId.length > 0){
            throw new Error("Informe o id do Usuário que deseja deixar de seguir.")
        }

        const followingData = {
            userToUnFollowId: req.body.userToUnFollowId
        }

        const authenticator = new Authenticator()
        const user = authenticator.getData(token)

        const userDb = new UserDatabase()
        const followingUser = await userDb.getUserById(followingData.userToUnFollowId)

        const followingDb = new FollowingDatabase()
        await followingDb.unfollowUser(user.id, followingData.userToUnFollowId)

        res.status(200).send({
            message: `Você deixou de seguir ${followingUser.name}.`
        })
    } catch (error) {
        res.status(400).send({message: error.message})
    } finally {
        BaseDatabase.destroyConnection()
    }
}