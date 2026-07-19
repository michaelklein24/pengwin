export abstract class Event {
    constructor() { }

    public get type(): string {
        return this.constructor.name;
    }
}

export type EventClass<T extends Event> = new (...args: any[]) => T;