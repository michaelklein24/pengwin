import type { EventClass, Event } from "./Event.ts";

export class Subscription<T extends Event = Event> {
    constructor(
        public readonly id: string,
        public readonly eventClass: EventClass<T>,
        private readonly onUnsubscribe: (sub: Subscription<T>) => void
    ) {}

    /**
     * Self-destructs this subscription from the EventBus registry.
     */
    public unsubscribe(): void {
        this.onUnsubscribe(this);
    }
}