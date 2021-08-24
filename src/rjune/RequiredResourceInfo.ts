import { ResourceType } from './ResourceType';

// represents an ingredient input to an assembler recipe
export interface RequiredResourceInfo {
  resourceType: ResourceType;
  count: number;
}
