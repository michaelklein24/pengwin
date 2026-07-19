import type UserModel from "../models/UserModel.ts";
import CRUDRepository from "../core/database/CRUDRepository.ts";
import type { IDbSession } from "../core/database/interfaces.ts";

export class UserRepository extends CRUDRepository<UserModel> {

    constructor(dbSession: IDbSession) {
        super(dbSession);
    }
}