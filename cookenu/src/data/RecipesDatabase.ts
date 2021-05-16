import { BaseDatabase } from "./BaseDatabase";


export class RecipesDatabase extends BaseDatabase {
    private static TABLE_NAME = "CookenuRecipes"

    public async createRecipe(id: string, title: string, description: string, creation_date: string, user_id:string ): Promise<void> {
        await this.getConnection()
        .insert({
            id,
            title,
            description,
            creation_date,
            user_id
        })
        .into(RecipesDatabase.TABLE_NAME)
    }

    public async getRecipeById (id: string): Promise<any> {
        const response = await this.getConnection()
        .select("*")
        .from(RecipesDatabase.TABLE_NAME)
        .where("id", id)

        return response[0]
    }

    public async deleteRecipeById(id: string): Promise<void> {
        await this.getConnection()
        .delete("*")
        .from(RecipesDatabase.TABLE_NAME)
        .where("id", id)
    }

    public async editRecipeById(id: string, title: string, description:string): Promise<void> {
        await this.getConnection()
        .raw(`
            UPDATE ${RecipesDatabase.TABLE_NAME}
            SET title = "${title}", description = "${description}"
            WHERE id = "${id}";
        `)    
    }
}