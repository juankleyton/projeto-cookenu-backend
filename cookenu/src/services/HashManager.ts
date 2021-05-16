import * as bcrypt from 'bcryptjs'

export class HashManager {
    public async hash(plaintext: string): Promise<string> {
        const rounds: number = Number(process.env.BCRYPT_COST)
        const salt: string = await bcrypt.genSalt(rounds)

        const result = await bcrypt.hash(plaintext, salt)

        return result
    } 

    public async compare(plaintext: string, cypherPassword: string): Promise<boolean> {
        return bcrypt.compare(plaintext, cypherPassword)
    }
}