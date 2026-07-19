import type AbstractModel from "./AbstractModel.ts";

export interface IDbSession {
    findById<T extends AbstractModel>(modelClass: new (...args: any[]) => T, id: string): Promise<T | null>;
    insert<T extends AbstractModel>(model: T): Promise<void>;
    update<T extends AbstractModel>(model: T): Promise<void>;
    delete<T extends AbstractModel>(modelClass: new (...args: any[]) => T, id: string): Promise<void>;
    all<T extends AbstractModel>(modelClass: new (...args: any[]) => T, predicate?: (model: T) => boolean): Promise<T[]>;
    
    beginTransaction(): Promise<void>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
    close(): Promise<void>;
}

export interface IDbConnection {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    
    // Abstract CRUD methods that accept a dynamic context client (for transactions)
    findOne(collection: string, id: string, txContext?: any): Promise<any>;
    findAll(collection: string, txContext?: any): Promise<any[]>;
    insertOne(collection: string, data: any, txContext?: any): Promise<void>;
    updateOne(collection: string, id: string, data: any, txContext?: any): Promise<void>;
    deleteOne(collection: string, id: string, txContext?: any): Promise<void>;
    
    // These clean up pool checkouts inside the session lifecycle
    acquireTxClient(): Promise<any>;
    releaseTxClient(client: any): Promise<void>;
}