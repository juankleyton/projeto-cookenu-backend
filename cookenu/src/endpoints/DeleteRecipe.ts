import {Request, Response} from 'express'
import { BaseDatabase } from '../data/BaseDatabase'
import { RecipesDatabase } from '../data/RecipesDatabase'
import { UserDatabase } from '../data/UserDatabase'
import { Authenticator } from '../services/Authenticator'

export const deleteRecipe = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization as string
        const id = req.body.id as string

        const authenticator = new Authenticator()
        const authData = authenticator.getData(token)

        const userDatabase = new UserDatabase()
        const user = await userDatabase.getUserById(authData.id)

        const recipeDatabase = new RecipesDatabase()
        const recipe = await recipeDatabase.getRecipeById(id)

        if(user.id === recipe.user_id || authData.role === "ADMIN") {
            await recipeDatabase.deleteRecipeById(id)
        }else {
            throw new Error ("Você só pode deletar suas próprias receitas!")
        }

        res.status(200).send({message: "Receita deletada com sucesso!"})
    } catch (error) {
        res.status(400).send({message: error.message})
    } finally {
        BaseDatabase.destroyConnection()
    }
}