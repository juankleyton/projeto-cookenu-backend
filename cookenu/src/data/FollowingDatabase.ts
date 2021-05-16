import { BaseDatabase } from "./BaseDatabase";


export class FollowingDatabase extends BaseDatabase {
    private static TABLE_NAME = "CookenuFollowing"

    public async followUser (user_id:string, user_to_follow_id: string): Promise<void> {
        await this.getConnection()
        .insert({
            user_id,
            user_to_follow_id
        })
        .into(FollowingDatabase.TABLE_NAME)
    }

    public async unfollowUser (user_id:string, user_to_unfollow_id: string): Promise<void> {
        await this.getConnection()
        .raw(`
            DELETE FROM ${FollowingDatabase.TABLE_NAME}
            WHERE user_id = "${user_id}" AND user_to_follow_id = "${user_to_unfollow_id}";
        `)
    }

    public async getFollowingUsersById (user_id: string): Promise<any> {
        const response = await this.getConnection()
        .select("user_to_follow_id")
        .from(FollowingDatabase.TABLE_NAME)
        .where("user_id", user_id)

        return response[0]
    }
}