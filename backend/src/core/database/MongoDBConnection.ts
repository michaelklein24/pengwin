// src/core/database/MongoDBConnection.ts
import { MongoClient, ObjectId, type Db, type ClientSession, type MongoClientOptions } from 'mongodb';
import type { IDbConnection } from './interfaces.ts';

export interface MongoConfig {
    host: string;
    port: number;
    database: string;
    username?: string;
    password?: string;
    options?: MongoClientOptions;
}

export class MongoDBConnection implements IDbConnection {
    private client: MongoClient;
    private db!: Db;

    constructor(config: MongoConfig) {
        const baseUri = `mongodb://${config.host}:${config.port}`;
        
        const clientOptions: MongoClientOptions = {
            ...config.options
        };

        // Attach structured auth credentials if provided
        if (config.username && config.password) {
            clientOptions.auth = {
                username: config.username,
                password: config.password
            };
        }

        this.client = new MongoClient(baseUri, clientOptions);
    }

    public async connect(): Promise<void> {
        console.log(`Attempting to connect to MongoDB database`);
        await this.client.connect();
        // Uses specified DB name or defaults to database set in connection string
        this.db = this.client.db(this.db.databaseName);
        console.log(`Successfully connected to MongoDB database: ${this.db.databaseName}`);
    }

    public async disconnect(): Promise<void> {
        await this.client.close();
        console.log("MongoDB connection closed safely.");
    }

    /**
     * Helper to wrap driver options with an active transaction context if present.
     */
    private getOptions(txContext?: ClientSession) {
        return txContext ? { session: txContext } : {};
    }

    /**
     * Helper to turn MongoDB's internal _id document properties back to an expected string 'id'
     */
    private normalizeResult(doc: any): any {
        if (!doc) return null;
        const { _id, ...rest } = doc;
        return { id: _id.toString(), ...rest };
    }

    public async acquireTxClient(): Promise<ClientSession> {
        const session = this.client.startSession();
        // MongoDB transactions require an explicit call to initiate
        session.startTransaction();
        return session;
    }

    public async releaseTxClient(session: ClientSession): Promise<void> {
        if (session) {
            await session.endSession();
        }
    }

    public async findOne(collection: string, id: string, txContext?: ClientSession): Promise<any> {
        if (!ObjectId.isValid(id)) return null;

        const doc = await this.db.collection(collection).findOne(
            { _id: new ObjectId(id) },
            this.getOptions(txContext)
        );

        return this.normalizeResult(doc);
    }

    public async findAll(collection: string, txContext?: ClientSession): Promise<any[]> {
        const docs = await this.db.collection(collection)
            .find({}, this.getOptions(txContext))
            .toArray();

        return docs.map(doc => this.normalizeResult(doc));
    }

    public async insertOne(collection: string, data: any, txContext?: ClientSession): Promise<void> {
        const { id, ...documentData } = data;
        
        // If the incoming model already has a string ID, try to preserve it as ObjectId
        if (id && ObjectId.isValid(id)) {
            (documentData as any)._id = new ObjectId(id);
        }

        await this.db.collection(collection).insertOne(
            documentData,
            this.getOptions(txContext)
        );
    }

    public async updateOne(collection: string, id: string, data: any, txContext?: ClientSession): Promise<void> {
        if (!ObjectId.isValid(id)) throw new Error(`Invalid MongoDB ObjectId: ${id}`);
        
        // Ensure we don't accidentally try to mutate or update the immutable _id key
        const { id: _, _id: __, ...updateFields } = data;

        await this.db.collection(collection).updateOne(
            { _id: new ObjectId(id) },
            { $set: updateFields },
            this.getOptions(txContext)
        );
    }

    public async deleteOne(collection: string, id: string, txContext?: ClientSession): Promise<void> {
        if (!ObjectId.isValid(id)) return;

        await this.db.collection(collection).deleteOne(
            { _id: new ObjectId(id) },
            this.getOptions(txContext)
        );
    }
}