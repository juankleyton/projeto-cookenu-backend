import { Request, Response } from "express";
import { BaseDatabase } from "../data/BaseDatabase";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";
import dayjs from 'dayjs'
import { RecipesDatabase } from "../data/RecipesDatabase";

export const createRecipe = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization as string

        if (!req.body.title || !req.body.description){
            throw new Error("Informe todos os dados!")
        }

        const recipeData = {
            title: req.body.title,
            description: req.body.description,
            creation_date: dayjs().format("YYYY-MM-DD")
        }


        const idGenerator = new IdGenerator()
        const newId = idGenerator.generateId()

        const authenticator = new Authenticator()
        const user = authenticator.getData(token)

        const recipesDatabase = new RecipesDatabase()
        await recipesDatabase.createRecipe(newId, recipeData.title, recipeData.description, recipeData.creation_date, user.id)

        res.status(200).send({
            message: "Receita criada com sucesso!"
        })
    } catch (error) {
        res.status(400).send({message: error.message})
    } finally {
        BaseDatabase.destroyConnection()
    }
}