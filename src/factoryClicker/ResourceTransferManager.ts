import { Recipe } from './Recipe';
import { ReceipeResult } from './RecipeResult';
import { RequiredResourceInfo } from './RequiredResourceInfo';
import { ResourceType } from './ResourceType';

export class ResourceTransferManager {
  public resourceContainer: any;

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

  returnRecipeResult(result: ReceipeResult) {
    this.returnResource(result.resourceType, result.count);
  }
}
