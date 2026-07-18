import type { PostgresConnection } from '../../connection/PostgresConnection.ts';
import type { CreateUserInput, UpdateUserInput, UserModel } from '../../models/user.ts';
import type { UserRepository } from '../UserRepository.ts';

interface UserRow {
  id: string;
  name: string;
  email: string;
}

function toUserModel(row: UserRow): UserModel {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
  };
}

function quoteIdentifier(name: string): string {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
    throw new Error(`Invalid SQL identifier: ${name}`);
  }

  return `"${name}"`;
}

export class PostgresUserRepository implements UserRepository {
  private readonly connection: PostgresConnection;

  constructor(connection: PostgresConnection) {
    this.connection = connection;
  }

  private tableName(): string {
    return quoteIdentifier(this.connection.getUsersTableName());
  }

  async findAll(): Promise<UserModel[]> {
    const result = await this.connection.getPool().query<UserRow>(
      `SELECT id, name, email FROM ${this.tableName()}`,
    );

    return result.rows.map(toUserModel);
  }

  async findById(id: string): Promise<UserModel | null> {
    const result = await this.connection.getPool().query<UserRow>(
      `SELECT id, name, email FROM ${this.tableName()} WHERE id = $1`,
      [id],
    );

    return result.rows[0] ? toUserModel(result.rows[0]) : null;
  }

  async create(input: CreateUserInput): Promise<UserModel> {
    const result = await this.connection.getPool().query<UserRow>(
      `INSERT INTO ${this.tableName()} (name, email) VALUES ($1, $2) RETURNING id, name, email`,
      [input.name, input.email],
    );

    const row = result.rows[0];
    if (!row) {
      throw new Error('Failed to create user');
    }

    return toUserModel(row);
  }

  async update(id: string, input: UpdateUserInput): Promise<UserModel | null> {
    const fields: string[] = [];
    const values: unknown[] = [id];

    if (input.name !== undefined) {
      values.push(input.name);
      fields.push(`name = $${values.length}`);
    }

    if (input.email !== undefined) {
      values.push(input.email);
      fields.push(`email = $${values.length}`);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    const result = await this.connection.getPool().query<UserRow>(
      `UPDATE ${this.tableName()} SET ${fields.join(', ')} WHERE id = $1 RETURNING id, name, email`,
      values,
    );

    return result.rows[0] ? toUserModel(result.rows[0]) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.connection.getPool().query(
      `DELETE FROM ${this.tableName()} WHERE id = $1 RETURNING id`,
      [id],
    );

    return result.rowCount === 1;
  }
}
