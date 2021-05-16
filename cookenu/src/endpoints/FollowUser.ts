import { Request, Response } from "express";
import { BaseDatabase } from "../data/BaseDatabase";
import { UserDatabase } from "../data/UserDatabase";
import { Authenticator } from "../services/Authenticator";
import { FollowingDatabase } from "../data/FollowingDatabase";

export const followUser = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization as string

        if (!req.body.userToFollowId && req.body.userToFollowId.length > 0){
            throw new Error("Informe o id do Usuário a ser seguido.")
        }

        const followingData = {
            userToFollowId: req.body.userToFollowId
        }

        const authenticator = new Authenticator()
        const user = authenticator.getData(token)

        const userDb = new UserDatabase()
        const followingUser = await userDb.getUserById(followingData.userToFollowId)

        const followingDb = new FollowingDatabase()
        await followingDb.followUser(user.id, followingData.userToFollowId)

        if(user.id === followingData.userToFollowId){
            throw new Error("Você não pode seguir você mesmo.")
        }

        res.status(200).send({
            message: `Agora você está seguindo ${followingUser.name}.`
        })
    } catch (error) {
        if(error.message.includes("PRIMARY")){
            res.status(400).send({message: "Você já está seguindo esta pessoa!"})
        }

        res.status(400).send({message: error.message})
    } finally {
        BaseDatabase.destroyConnection()
    }
}