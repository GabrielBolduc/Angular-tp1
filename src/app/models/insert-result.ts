export class InsertResult {

    readonly success: boolean
    readonly lastInsertId: number

    constructor({ success, lastInsertId }: {success: boolean, lastInsertId: number}) {
        this.success = success
        this.lastInsertId = lastInsertId
    }

}