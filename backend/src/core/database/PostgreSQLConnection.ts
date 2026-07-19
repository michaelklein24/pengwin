// src/core/database/PostgresConnection.ts
import pg from 'pg';
import type { IDbConnection } from './interfaces.ts';

export interface PostgresConfig extends pg.PoolConfig {
    host: string;
    port: number;
    database: string;
    user?: string;
    password?: string;
}

export class PostgresConnection implements IDbConnection {
    private pool: pg.Pool;

    constructor(config: PostgresConfig) {
        this.pool = new pg.Pool({
            ...config,
            max: config.max || 10
        });
    }

    public async connect(): Promise<void> {
        const client = await this.pool.connect();
        client.release();
        console.log("Successfully verified PostgreSQL connection pool.");
    }

    public async disconnect(): Promise<void> {
        await this.pool.end();
        console.log("PostgreSQL connection pool has closed.");
    }

    // Helper to determine whether to run against the pool or an active transaction client
    private getExecutor(txContext?: any) {
        return txContext ?? this.pool;
    }

    public async acquireTxClient(): Promise<pg.PoolClient> {
        return await this.pool.connect();
    }

    public async releaseTxClient(client: pg.PoolClient): Promise<void> {
        if (client) client.release();
    }

    public async findOne(collection: string, id: string, txContext?: any): Promise<any> {
        const query = `SELECT * FROM "${collection}" WHERE id = $1 LIMIT 1;`;
        const result = await this.getExecutor(txContext).query(query, [id]);
        return result.rows[0] || null;
    }

    public async findAll(collection: string, txContext?: any): Promise<any[]> {
        const query = `SELECT * FROM "${collection}";`;
        const result = await this.getExecutor(txContext).query(query);
        return result.rows;
    }

    public async insertOne(collection: string, data: any, txContext?: any): Promise<void> {
        const keys = Object.keys(data).map(k => `"${k}"`).join(', ');
        const values = Object.values(data);
        const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

        const query = `INSERT INTO "${collection}" (${keys}) VALUES (${placeholders});`;
        await this.getExecutor(txContext).query(query, values);
    }

    public async updateOne(collection: string, id: string, data: any, txContext?: any): Promise<void> {
        // Exclude id from being updated in the SET clause
        const fieldsToUpdate = Object.keys(data).filter(key => key !== 'id');
        const values = fieldsToUpdate.map(key => data[key]);
        
        const setClause = fieldsToUpdate
            .map((key, index) => `"${key}" = $${index + 1}`)
            .join(', ');

        // Push ID as the final parameter for the WHERE constraint
        values.push(id);
        const idPlaceholder = `$${values.length}`;

        const query = `UPDATE "${collection}" SET ${setClause} WHERE id = ${idPlaceholder};`;
        await this.getExecutor(txContext).query(query, values);
    }

    public async deleteOne(collection: string, id: string, txContext?: any): Promise<void> {
        const query = `DELETE FROM "${collection}" WHERE id = $1;`;
        await this.getExecutor(txContext).query(query, [id]);
    }
}