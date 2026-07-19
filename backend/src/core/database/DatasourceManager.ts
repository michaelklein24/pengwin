import type { IDbConnection, IDbSession } from "./interfaces.ts";
import DbSession from "./DbSession.ts";

export class DatasourceManager {
    private static instance: DatasourceManager;
    private datasources: Map<string, IDbConnection> = new Map();

    private constructor() {}

    public static getInstance(): DatasourceManager {
        if (!DatasourceManager.instance) {
            DatasourceManager.instance = new DatasourceManager();
        }
        return DatasourceManager.instance;
    }

    public registerDatasource(name: string, connection: IDbConnection): void {
        this.datasources.set(name, connection);
    }

    public async openSession(datasourceName: string = "default"): Promise<IDbSession> {
        const connection = this.datasources.get(datasourceName);
        if (!connection) {
            throw new Error(`Datasource "${datasourceName}" has not been registered.`);
        }
        
        await connection.connect(); 
        return new DbSession(connection);
    }

    public async connectAll(): Promise<void> {
        for (const connection of this.datasources.values()) {
            await connection.connect();
        }
    }

    public async closeAll(): Promise<void> {
        for (const connection of this.datasources.values()) {
            await connection.disconnect();
        }
    }
}