import { Component, OnInit } from '@angular/core';
import { RecipeMap } from 'src/factoryClicker/data/RecipeMap';
import { Recipe } from 'src/factoryClicker/Recipe';
import { ResourceTransferManager } from 'src/factoryClicker/ResourceTransferManager';
import { ResourceType } from '../../factoryClicker/ResourceType';

// these are options in the recipe dropdown, and isn't used outside this class
interface RecipeOptionInfo {
  value: ResourceType;
  name: string;
}

@Component({
  selector: 'Main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass'],
})

export class MainComponent implements OnInit {

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

  public resourceTransferer: ResourceTransferManager = new ResourceTransferManager(this.resources);

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

  public resourceContainers: Array<any> = [
    {
      displayName: "Iron",
      resourceType: ResourceType.Iron
    }
  ]
  
  ngOnInit(): void {}

  onSelectionChanged() {}

  onClickResource(resourceType: ResourceType) {
    const recipe: Recipe = RecipeMap[resourceType];
    if (recipe) { 
      if (this.canSatisfyRecipe(recipe)) { 
        this.processResources(recipe);
        this.clickCount += this.increment;
        if (this.clickCount >= this.expToNextLevel) {
          this.currentLevel++;
          this.clickCount = 0;
          this.expToNextLevel *= 2.0;         
        }
      }
    }
  }

  canSatisfyRecipe(recipe: Recipe) : boolean { 
    for (const requiredResource of recipe.requiredResources) {
      const requiredAmount = requiredResource.count;
      const requiredResourceType = requiredResource.resourceType;
      const ownedResourceAmount = this.resources[requiredResourceType].count;        
      if (ownedResourceAmount < requiredAmount) { 
        return false;
      }
    }
    return true;
  }

  processResources(recipe: Recipe) {
    for (const requiredResource of recipe.requiredResources) {
      const requiredAmount = requiredResource.count;
      const requiredResourceType = requiredResource.resourceType;
      this.resources[requiredResourceType].count -= requiredAmount;
    }
    this.resources[recipe.output.resourceType].count += recipe.output.count;
  }
}