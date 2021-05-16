import dayjs from "dayjs";
import { Request, Response } from "express";
import { BaseDatabase } from "../data/BaseDatabase";
import { RecipesDatabase } from "../data/RecipesDatabase";
import { Authenticator } from "../services/Authenticator";

export const getRecipe = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization as string
        const id = req.params.id as string

        const authenticator = new Authenticator()
        authenticator.getData(token)

        const recipeDatabase = new RecipesDatabase()
        const recipe = await recipeDatabase.getRecipeById(id)

        console.log(recipe)

        res.status(200).send({
            id: recipe.id,
            title: recipe.title,
            description: recipe.description,
            createdAt: dayjs(recipe.creation_date).format("DD/MM/YYYY")
        })
    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    } finally {
        BaseDatabase.destroyConnection()
    }
}