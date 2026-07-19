import CRUDRepository from "../core/database/CRUDRepository.ts";
import type { IDbSession } from "../core/database/interfaces.ts";
import type PasswordModel from "../models/PasswordModel.ts";

export default class PasswordRepository extends CRUDRepository<PasswordModel> {
    constructor(protected dbSession: IDbSession) {
        super(dbSession);
    }

}