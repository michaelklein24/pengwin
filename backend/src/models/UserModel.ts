import AbstractModel from "../core/database/AbstractModel.ts";

export default class UserModel extends AbstractModel {
    public id: string = '';
    public firstName: string = '';
    public lastName: string = '';
    public username: string = '';
    public email: string = '';
    public password: string = '';
}