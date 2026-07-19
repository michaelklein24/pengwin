import { Event } from "../core/event/Event.ts";
import type UserModel from "../models/UserModel.ts";

export default class WinCreatedEvent extends Event {
    constructor(public readonly user: UserModel) {
        super();
    }
}