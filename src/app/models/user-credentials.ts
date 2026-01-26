export class UserCredentials {
    readonly email: string
    readonly password: string

    constructor({ username, password }: { username: string, password: string }) {
        this.email = username.toLowerCase()
        this.password = password
    }

}