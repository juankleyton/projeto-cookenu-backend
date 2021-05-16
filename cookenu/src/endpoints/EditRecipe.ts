import {Request, Response} from 'express'
import { BaseDatabase } from '../data/BaseDatabase'
import { RecipesDatabase } from '../data/RecipesDatabase'
import { UserDatabase } from '../data/UserDatabase'
import { Authenticator } from '../services/Authenticator'

export const editRecipe = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization as string
        const recipeData = {
            id: req.body.id,
            title: req.body.title,
            description: req.body.description
        }

        const authenticator = new Authenticator()
        const authData = authenticator.getData(token)

        const userDatabase = new UserDatabase()
        const user = await userDatabase.getUserById(authData.id)

        const recipeDatabase = new RecipesDatabase()
        const recipe = await recipeDatabase.getRecipeById(recipeData.id)

        if (!recipeData.title || !recipeData.description) {
            throw new Error ("Informe o título e a descrição da receita.")
        }

        if(user.id === recipe.user_id || authData.role === "ADMIN") {
            await recipeDatabase.editRecipeById(recipeData.id, recipeData.title, recipeData.description)
        }else {
            throw new Error ("Você só pode editar suas próprias receitas!")
        }

        res.status(200).send({message: "Receita editada com sucesso!"})
    } catch (error) {
        res.status(400).send({message:error.message})
    } finally {
        BaseDatabase.destroyConnection()
    }
}