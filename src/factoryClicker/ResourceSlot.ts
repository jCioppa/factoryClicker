import { ResourceType } from "./ResourceType";

export interface ResourceSlot { 
    resourceType: ResourceType;
    count: number;
    max: number;
}

export const resourceSlot = (resourceType: ResourceType, count: number, max: number): ResourceSlot => ({resourceType, count, max}) 