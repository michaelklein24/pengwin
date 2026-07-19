// src/core/database/index.ts

// 1. Export the interfaces that the application interacts with
export type { IDbSession, IDbConnection } from "./interfaces.ts";

// 2. Export the primary Singleton Manager that setups the connection pool
export { DatasourceManager } from "./DatasourceManager.ts";

// Note: We don't need to export DbConnection or DbSession explicitly 
// if they are managed internally by the DatasourceManager. 
// This keeps your framework's public API surface small and clean!