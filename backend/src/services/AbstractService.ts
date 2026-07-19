import EventBus from "../core/event/EventBus.ts";
import ConfigService from "./ConfigService.ts";

export default abstract class AbstractService {
    protected readonly eventBus: EventBus = EventBus.getInstance();
    protected readonly configService: ConfigService = ConfigService.getInstance();
}