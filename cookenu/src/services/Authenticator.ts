import * as jwt from 'jsonwebtoken'

export class Authenticator {
    public generateToken(data: AuthenticationData): string {
        const token = jwt.sign(
            {
                id: data.id,
                email: data.email,
                role: data.role
            }, 
            process.env.JWT_KEY as string, 
            {expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as string}
        )
        return token
    }

    public getData(token: string): AuthenticationData {
        const data = jwt.verify(token, process.env.JWT_KEY as string) as any;
        const result = {
            id: data.id,
            email: data.email,
            role: data.role
        }

        return result
    }
}

export interface AuthenticationData{
    id: string,
    email: string,
    role: ROLE_TYPE
}

export enum ROLE_TYPE{
    NORMAL = "NORMAL",
    ADMIN = "ADMIN"
}