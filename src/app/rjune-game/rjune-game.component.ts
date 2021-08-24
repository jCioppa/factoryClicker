import { Component, OnInit } from '@angular/core';
import { Recipe } from 'src/rjune/Recipe';
import { ReceipeResult } from 'src/rjune/RecipeResult';
import { RequiredResourceInfo } from 'src/rjune/RequiredResourceInfo';
import { ResourceType } from '../../rjune/ResourceType';

// these are options in the recipe dropdown, and isn't used outside this class
interface RecipeOptionInfo {
  value: ResourceType;
  name: string;
}

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

@Component({
  selector: 'RjuneGame',
  templateUrl: './rjune-game.component.html',
  styleUrls: ['./rjune-game.component.sass'],
})
export class RjuneGameComponent implements OnInit {
  public clickCount: number = 0;
  public expToNextLevel: number = 25;
  public currentLevel: number = 0;
  public increment: number = 1;
  public resource = ResourceType;
  public currentOption: ResourceType = ResourceType.None;

  public resources: any = {
    [ResourceType.Coal]: {
      count: 0,
    },
    [ResourceType.Copper]: {
      count: 0,
    },
    [ResourceType.Iron]: {
      count: 0,
    },
    [ResourceType.IronGear]: {
      count: 0,
    },
    [ResourceType.CopperWire]: {
      count: 0,
    },
  };

  public resourceTransferer: ResourceTransferManager =
    new ResourceTransferManager(this.resources);

  public recipeOptions: Array<RecipeOptionInfo> = [
    {
      value: ResourceType.None,
      name: 'None',
    },

    {
      value: ResourceType.IronGear,
      name: 'Iron Gears',
    },

    {
      value: ResourceType.CopperWire,
      name: 'Copper Wire',
    },
  ];

  ngOnInit(): void {}

  onSelectionChanged() {}

  onClickResource(resourceType: ResourceType) {
    if (this.processResources(resourceType)) {
      this.clickCount += this.increment;
      if (this.clickCount >= this.expToNextLevel) {
        this.currentLevel++;
        this.clickCount = 0;
        this.expToNextLevel *= 2.0;
      }
    }
  }

  processResources(resourceType: ResourceType): boolean {
    switch (resourceType) {
      case ResourceType.IronGear: {
        if (this.resources[ResourceType.Iron].count >= 2) {
          this.resources[ResourceType.Iron].count -= 2;
          this.resources[ResourceType.IronGear].count += 1;
          return true;
        } else {
          return false;
        }
      }
      case ResourceType.CopperWire: {
        if (this.resources[ResourceType.CopperWire].count >= 2) {
          this.resources[ResourceType.Copper].count -= 2;
          this.resources[ResourceType.CopperWire].count += 1;
          return true;
        } else {
          return false;
        }
      }
      default: {
        this.resources[resourceType].count += this.increment;
        return true;
      }
    }
  }
}
