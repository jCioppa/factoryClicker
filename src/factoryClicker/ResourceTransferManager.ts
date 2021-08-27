import { Recipe } from './Recipe';
import { ReceipeResult } from './RecipeResult';
import { RequiredResourceInfo } from './RequiredResourceInfo';
import { ResourceType } from './ResourceType';

interface ResourceSource {
    resourceType: ResourceType; 
    count: number;
}

export interface ResourceQuery { 
  resourceType: ResourceType; 
  count: number;
}

export const resourceQuery  = (resourceType: ResourceType, count: number ): ResourceQuery => ({resourceType, count})

class ResourcePipe { 
    
    private from: ResourceSource;
    private to: ResourceSource;

    constructor(from: ResourceSource, to: ResourceSource) { 
      this.from = from;
      this.to = to;
    }

    pushTo(amount: number) {
      if (this.from.count >= amount) {
        this.from.count -= amount;
        this.to.count += amount;
      }
    }

    pullFrom(amount: number) {
      if (this.to.count >= amount) {
        this.to.count -= amount;
        this.from.count += amount;
      }
    }

}

export class ResourceTransferManager {
  public resourceContainer: any;
  public inventoryPipe?: ResourcePipe;

  constructor(resourceContainer: any) {
    this.resourceContainer = resourceContainer;
  }

  tryTransferResource(resourceType: ResourceType, amount: number): boolean {
    if (this.resourceContainer[resourceType].count >= amount) {
      this.resourceContainer[resourceType].count -= amount;
      return true;
    }
    return false;
  }

  returnResource(resourceType: ResourceType, amount: number) {
    this.resourceContainer[resourceType].count += amount;
  }

  satisfiesRecipe(recipe: Recipe): boolean {
    for (let requiredResource of recipe.requiredResources) {
      const resourceRequirement = requiredResource.count;
      const availableResources =
        this.resourceContainer[requiredResource.resourceType].count;
      if (availableResources < resourceRequirement) {
        return false;
      }
    }
    return true;
  }

  transferRequiredRecipeResources(recipe: Recipe): Array<RequiredResourceInfo> {
    let resources: Array<RequiredResourceInfo> = [];
    
    for (let requiredResource of recipe.requiredResources) {
      const resourceRequirement = requiredResource.count;
      this.resourceContainer[requiredResource.resourceType].count -=
        resourceRequirement;
      resources.push({ ...requiredResource });
    }
    
    return resources;
  }

  getFromSource(resourceType: ResourceType, amount: number): ResourceQuery { 

    let amountFetched: number = 0;  
    if (this.resourceContainer[resourceType].count >= amount){
      this.resourceContainer[resourceType].count -= amount;
      amountFetched = amount;
    }
    return resourceQuery(resourceType, amountFetched);
  }

  sendToSource(result: ReceipeResult) {
    this.resourceContainer[result.resourceType].count += result.count;
  }
}
