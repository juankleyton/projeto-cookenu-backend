import dayjs from "dayjs";
import { ROLE_TYPE } from "../services/Authenticator";
import { BaseDatabase } from "./BaseDatabase";
import { FollowingDatabase } from "./FollowingDatabase";


export class UserDatabase extends BaseDatabase {
    private static TABLE_NAME = "CookenuUsers"

    public async createUser(id: string, name: string, email: string, password: string, role?: ROLE_TYPE): Promise<void> {
        await this.getConnection()
        .insert({
            id,
            name,
            email,
            password,
            role
        })
        .into(UserDatabase.TABLE_NAME)
    }

    public async getUserByEmail (email: string): Promise<any> {
        const response = await this.getConnection()
        .select("*")
        .from(UserDatabase.TABLE_NAME)
        .where("email", email)

        return response[0]
    }

    public async getUserById (id: string): Promise<any> {
        const response = await this.getConnection()
        .select("*")
        .from(UserDatabase.TABLE_NAME)
        .where("id", id)

        return response[0]
    }

    public async getFeedById (user_id: string): Promise<any> {
        const response = await this.getConnection()
        .raw(`
            SELECT CookenuRecipes.id, title, description, creation_date as createdAt, CookenuRecipes.user_id as userId, CookenuUsers.name
            FROM CookenuUsers
            JOIN CookenuRecipes on CookenuUsers.id = CookenuRecipes.user_id
            JOIN CookenuFollowing on CookenuRecipes.user_id = CookenuFollowing.user_to_follow_id
            WHERE CookenuFollowing.user_id = "${user_id}"
            ORDER BY CookenuRecipes.creation_date DESC;
        `)

        return response[0]
    }

    public async deleteUser (user_id: string): Promise<void> {
        await this.getConnection()
        .delete("*")
        .from("CookenuFollowing")
        .where("user_id", user_id)
        .orWhere("user_to_follow_id", user_id)

        await this.getConnection()
        .delete("*")
        .from("CookenuRecipes")
        .where("user_id", user_id)
        
        await this.getConnection()
        .delete("*")
        .from(UserDatabase.TABLE_NAME)
        .where("id", user_id)        
    }
}