import express, { type Express } from 'express';
import { configService } from './services/ConfigService.ts';
import { DatasourceManager } from './core/database/DatasourceManager.ts';
import { PostgresConnection, type PostgresConfig } from './core/database/PostgreSQLConnection.ts';
import { MongoDBConnection, type MongoConfig } from './core/database/MongoDBConnection.ts';

class Server {
    private readonly datasourceManager : DatasourceManager;
    private readonly app: Express = express();
    private readonly PORT = configService.getNumber("SERVER_PORT");

    constructor() {
        this.datasourceManager = DatasourceManager.getInstance();
    }

    public async start() {

        const pgConfig: PostgresConfig = {
            host: configService.getString("PG_DB_HOST") || 'localhost',
            port: configService.getNumber("PG_DB_PORT") || 5432,
            database: configService.getString("PG_DB_NAME") || 'mydb',
            user: configService.getString("PG_DB_USER") || 'admin',
            password: configService.getString("PG_DB_PASSWORD") || ''
        };

        const mongoConfig: MongoConfig = {
            host: process.env.MONGO_HOST || 'localhost',
            port: parseInt(process.env.MONGO_PORT || '27017'),
            database: process.env.MONGO_NAME || 'mydb',
            username: process.env.MONGO_USER || 'root',
            password: process.env.MONGO_PASSWORD || 'secret456'
        };

        this.datasourceManager.registerDatasource("POSTGRES", new PostgresConnection(pgConfig));
        // this.datasourceManager.registerDatasource("MONGODB", new MongoDBConnection(mongoConfig));
        await this.datasourceManager.connectAll()

        this.app.listen(this.PORT, () => {
            console.log(`Backend is running on http://localhost:${this.PORT}`);
        });
    }

    public stop() {
        const shutdownServer = async (signal: string) => {
            console.log(`Received ${signal}. Starting graceful shutdown...`);
    
            this.datasourceManager.closeAll();
        };
    
        process.on("SIGINT", () => shutdownServer("SIGINT"));
        process.on("SIGTERM", () => shutdownServer("SIGTERM")); 
    }
}

const server : Server = new Server();
server.start();