import type AbstractModel from "./AbstractModel.ts";
import type { IDbSession } from "./interfaces.ts";

export interface ICRUDRepository<T extends AbstractModel> {
    create(model: T): Promise<T>;
    read(id: string): Promise<T>;
    update(model: T): Promise<T>;
    delete(id: string): Promise<void>;
    findAll(): Promise<T[]>;
    findOne(id: string): Promise<T>;
    findOneBy(predicate: (model: T) => boolean): Promise<T>;
    findManyBy(predicate: (model: T) => boolean): Promise<T[]>;
    findManyBy(predicate: (model: T) => boolean): Promise<T[]>;
}

export default class CRUDRepository<T extends AbstractModel> implements ICRUDRepository<T> {
    constructor(protected readonly dbSession: IDbSession) {
        this.dbSession = dbSession;
    }
    create(model: T): T {
        return this.dbSession.insert(model);
    }
    read(id: string): Promise<T> {
        return this.dbSession.findById(model, id);
    }
    update(model: T): Promise<T> {
        return this.dbSession.update(model);    
    }
    delete(id: string): Promise<void> {
        this.dbSession.delete(model, id);
    }
    findAll(): Promise<T[]> {
        this.dbSession.all(model);
    }
    findOne(id: string): Promise<UserModel> {
        this.dbSession.findById(model, id);
    }
    findOneBy(predicate: (model: UserModel) => boolean): Promise<UserModel> {
        this.dbSession.findById(model, predicate);
    }
    findManyBy(predicate: (model: UserModel) => boolean): Promise<UserModel[]> {
        this.dbSession.all(model, predicate);
    }
}