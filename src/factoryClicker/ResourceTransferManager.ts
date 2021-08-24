import { Recipe } from './Recipe';
import { ReceipeResult } from './RecipeResult';
import { RequiredResourceInfo } from './RequiredResourceInfo';

export class ResourceTransferManager {
  public resourceContainer: any;

  constructor(resourceContainer: any) {
    this.resourceContainer = resourceContainer;
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

  transferResources(recipe: Recipe): Array<RequiredResourceInfo> {
    let resources: Array<RequiredResourceInfo> = [];

    for (let requiredResource of recipe.requiredResources) {
      const resourceRequirement = requiredResource.count;
      this.resourceContainer[requiredResource.resourceType].count -=
        resourceRequirement;
      resources.push({ ...requiredResource });
    }

    return resources;
  }

  returnResources(result: ReceipeResult) {
    this.resourceContainer[result.resourceType].count += result.count;
  }
}
