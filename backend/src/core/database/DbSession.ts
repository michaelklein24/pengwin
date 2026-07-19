// src/core/database/DbSession.ts
import type AbstractModel from "./AbstractModel.ts";
import type { IDbSession, IDbConnection } from "./interfaces.ts";

export default class DbSession implements IDbSession {
    private identityMap: Map<string, AbstractModel> = new Map();
    private txClient: any = null; // Holds our pinned connection wire during transactions

    constructor(private readonly connection: IDbConnection) {}

    private getCollectionName(modelClass: Function): string {
        return modelClass.name.toLowerCase().replace("model", "s"); 
    }

    // Strips functions and private variables so we pass clean data to the connection layer
    private serializeModel(model: AbstractModel): any {
        const plainData: Record<string, any> = {};
        for (const [key, value] of Object.entries(model)) {
            // Skips hidden properties like '_passwordHash' or framework properties
            if (!key.startsWith('_') && typeof value !== 'function') {
                plainData[key] = value;
            }
        }
        return plainData;
    }

    public async beginTransaction(): Promise<void> {
        if (this.txClient) throw new Error("A transaction is already active in this session.");
        this.txClient = await this.connection.acquireTxClient();
        await this.txClient.query("BEGIN;");
    }

    public async commit(): Promise<void> {
        if (!this.txClient) throw new Error("No active transaction to commit.");
        await this.txClient.query("COMMIT;");
        await this.connection.releaseTxClient(this.txClient);
        this.txClient = null;
    }

    public async rollback(): Promise<void> {
        if (!this.txClient) return;
        await this.txClient.query("ROLLBACK;");
        await this.connection.releaseTxClient(this.txClient);
        this.txClient = null;
    }

    public async findById<T extends AbstractModel>(
        modelClass: new (...args: any[]) => T, 
        id: string
    ): Promise<T | null> {
        const cacheKey = `${modelClass.name}:${id}`;
        if (this.identityMap.has(cacheKey)) return this.identityMap.get(cacheKey) as T;

        const collection = this.getCollectionName(modelClass);
        const row = await this.connection.findOne(collection, id, this.txClient);

        if (!row) return null;

        const model = new modelClass(row);
        this.identityMap.set(cacheKey, model);
        return model;
    }

    public async insert<T extends AbstractModel>(model: T): Promise<void> {
        const collection = this.getCollectionName(model.constructor);
        const data = this.serializeModel(model);
        
        await this.connection.insertOne(collection, data, this.txClient);
        this.identityMap.set(`${model.constructor.name}:${(model as any).id}`, model);
    }

    public async update<T extends AbstractModel>(model: T): Promise<void> {
        const collection = this.getCollectionName(model.constructor);
        const id = (model as any).id;
        if (!id) throw new Error("Cannot update a model instance missing an 'id' property.");
        
        const data = this.serializeModel(model);
        await this.connection.updateOne(collection, id, data, this.txClient);
    }

    public async delete<T extends AbstractModel>(modelClass: new (...args: any[]) => T, id: string): Promise<void> {
        const collection = this.getCollectionName(modelClass);
        await this.connection.deleteOne(collection, id, this.txClient);
        this.identityMap.delete(`${modelClass.name}:${id}`);
    }

    public async all<T extends AbstractModel>(
        modelClass: new (...args: any[]) => T, 
        predicate?: (model: T) => boolean
    ): Promise<T[]> {
        const collection = this.getCollectionName(modelClass);
        const rows = await this.connection.findAll(collection, this.txClient);
        
        const instances = rows.map(row => new modelClass(row));
        
        if (predicate) {
            return instances.filter(predicate);
        }
        return instances;
    }

    public async close(): Promise<void> {
        if (this.txClient) {
            await this.rollback();
        }
        this.identityMap.clear();
    }
}