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

  tryTransferResource(resourceType: ResourceType, amount: number): boolean {
    if (this.resourceContainer.ableToRemove(resourceType, amount)) { 
      this.resourceContainer.remove(resourceType, amount);
      return true;
    }    
    return false;
  }

  returnResource(resourceType: ResourceType, amount: number): number {
    const result = this.resourceContainer.add(resourceType, amount);
    return result.added;
  }

  getFromSource(resourceType: ResourceType, amount: number): ResourceQuery { 
    const amountFetched = this.resourceContainer.remove(resourceType, amount);
    return resourceQuery(resourceType, amountFetched);
  }

  sendToSource(result: ReceipeResult): number {
    return this.returnResource(result.resourceType, result.count)
  }
}
