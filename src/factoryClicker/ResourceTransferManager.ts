import { ReceipeResult } from './RecipeResult';
import { ResourceInventory } from './ResourceInventory';
import { ResourceType } from './ResourceType';

export interface ResourceQuery { 
  resourceType: ResourceType; 
  count: number;
}

export const resourceQuery  = (resourceType: ResourceType, count: number ): ResourceQuery => ({resourceType, count})

export class ResourceTransferManager {

  public resourceContainer: ResourceInventory;

  constructor(resourceContainer: ResourceInventory) {
    this.resourceContainer = resourceContainer;
  }

  // returns resources to the source. Returns the number added. 
  pushResources(resourceType: ResourceType, amount: number): number { 
    const result = this.resourceContainer.add(resourceType, amount);
    return result.added;
  }

  getResources(resourceType: ResourceType, amount: number): number { 
    const amountFetched = this.resourceContainer.remove(resourceType, amount);
    return amountFetched;
  }
}
