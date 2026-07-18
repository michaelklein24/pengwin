import { ObjectId, type Document, type WithId } from 'mongodb';
import type { MongoConnection } from '../../connection/MongoConnection.ts';
import type { CreateWinInput, ImpactLevel, UpdateWinInput, WinModel } from '../../models/win.ts';
import type { WinRepository } from '../WinRepository.ts';

interface WinDocument extends Document {
  userId: string;
  title: string;
  description?: string;
  impact: ImpactLevel;
  tags: string[];
  challenges: string[];
  skills: string[];
  startDate: string;
  completionDate: string;
  collaborators: string[];
  evidence?: string;
}

function toWinModel(document: WithId<WinDocument>): WinModel {
  return {
    id: document._id.toString(),
    userId: document.userId,
    title: document.title,
    description: document.description,
    impact: document.impact,
    tags: document.tags,
    challenges: document.challenges,
    skills: document.skills,
    startDate: document.startDate,
    completionDate: document.completionDate,
    collaborators: document.collaborators,
    evidence: document.evidence,
  };
}

function toObjectId(id: string): ObjectId | null {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  return new ObjectId(id);
}

export class MongoWinRepository implements WinRepository {
  private readonly connection: MongoConnection;

  constructor(connection: MongoConnection) {
    this.connection = connection;
  }

  private collection() {
    return this.connection.getDb().collection<WinDocument>(this.connection.getWinsCollectionName());
  }

  async findAll(): Promise<WinModel[]> {
    const documents = await this.collection().find().toArray();
    return documents.map(toWinModel);
  }

  async findById(id: string): Promise<WinModel | null> {
    const objectId = toObjectId(id);
    if (!objectId) {
      return null;
    }

    const document = await this.collection().findOne({ _id: objectId });
    return document ? toWinModel(document) : null;
  }

  async findByUserId(userId: string): Promise<WinModel[]> {
    const documents = await this.collection().find({ userId }).toArray();
    return documents.map(toWinModel);
  }

  async create(input: CreateWinInput): Promise<WinModel> {
    const result = await this.collection().insertOne({ ...input });
    const document = await this.collection().findOne({ _id: result.insertedId });

    if (!document) {
      throw new Error('Failed to retrieve win after insert');
    }

    return toWinModel(document);
  }

  async update(id: string, input: UpdateWinInput): Promise<WinModel | null> {
    const objectId = toObjectId(id);
    if (!objectId) {
      return null;
    }

    const document = await this.collection().findOneAndUpdate(
      { _id: objectId },
      { $set: input },
      { returnDocument: 'after' },
    );

    return document ? toWinModel(document) : null;
  }

  async delete(id: string): Promise<boolean> {
    const objectId = toObjectId(id);
    if (!objectId) {
      return false;
    }

    const result = await this.collection().deleteOne({ _id: objectId });
    return result.deletedCount === 1;
  }
}
