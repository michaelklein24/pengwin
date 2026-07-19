import AbstractModel from "../core/database/AbstractModel.ts";

export default class PasswordModel extends AbstractModel {
    constructor() {
        super();
    }
    public userId: string = '';
    public encryptedPassword: string = '';
}