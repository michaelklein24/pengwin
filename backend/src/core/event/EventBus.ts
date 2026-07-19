import type { EventClass } from "./Event.ts";
import { Subscription } from "./Subscription.js";

export default class EventBus {
    private static instance: EventBus;

    private readonly subscriptions: Map<
        string, 
        Array<{ 
            token: Subscription<any>; 
            callback: (event: any) => void 
        }>> = new Map();

    public static getInstance(): EventBus {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus();
        }
        return EventBus.instance;
    }

    public async publish(event: any): Promise<void> {
        // Collect subscribers for this event type AND all its parent types
        const allTargets: Array<{ callback: (event: any) => void }> = [];
        
        let currentProto = Object.getPrototypeOf(event);
        
        // Traverse up the prototype chain until we hit Object or null
        while (currentProto && currentProto.constructor !== Object) {
            const eventTypeName = currentProto.constructor.name;
            const targets = this.subscriptions.get(eventTypeName);
            
            if (targets && targets.length > 0) {
                allTargets.push(...targets);
            }
            
            currentProto = Object.getPrototypeOf(currentProto);
        }

        if (allTargets.length > 0) {
            // Snapshot array execution loop to preserve system stability if someone unsubscribes mid-cycle
            [...allTargets].forEach(({ callback }) => {
                try {
                    callback(event);
                } catch (error) {
                    console.error(`Error executing subscriber handler for event hierarchy:`, error);
                }
            });
        }
        return Promise.resolve();
    }

    public subscribe<T extends Event>(eventClass: EventClass<T>, callback: (event: T) => void): Subscription<T> {
        const eventType = eventClass.name;

        if (!this.subscriptions.has(eventType)) {
            this.subscriptions.set(eventType, []);
        }

        const subscriptionId = crypto.randomUUID();
        const subscription = new Subscription<T>(
            subscriptionId,
            eventClass,
            (sub) => this.unsubscribe(sub) 
        );

        this.subscriptions.get(eventType)!.push({
            token: subscription,
            callback: callback
        });

        return subscription;
    }

    public unsubscribe(subscription: Subscription<any>): void {
        const eventType = subscription.eventClass.name;
        const targets = this.subscriptions.get(eventType);

        if (!targets) return;

        // Filter out by checking the explicit unique subscription token instance ID
        const filtered = targets.filter(({ token }) => token.id !== subscription.id);

        if (filtered.length === 0) {
            this.subscriptions.delete(eventType);
        } else {
            this.subscriptions.set(eventType, filtered);
        }
    }
}