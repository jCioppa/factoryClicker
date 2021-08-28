import { Component, OnInit } from '@angular/core';
import { Recipe } from 'src/factoryClicker/Recipe';
import { ResourceTransferManager } from 'src/factoryClicker/ResourceTransferManager';
import { ResourceType } from '../../factoryClicker/ResourceType';
import { CommandService } from '../services/CommandService';
import { RecipeService } from '../services/RecipeService';

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

  availableAssemblers: Array<any> = [1, 2, 3];

  smelterDropdownOptions: Array<any> = [
    {
      displayName: 'Iron ',
      resourceType: ResourceType.Iron,
    },

    {
      displayName: 'Copper ',
      resourceType: ResourceType.Copper,
    },

    {
      displayName: 'Stone Bricks',
      resourceType: ResourceType.StoneBricks,
    },

    {
      displayName: 'Steel',
      resourceType: ResourceType.Steel,
    },
  ];

  public resourceInventory: any = {
    [ResourceType.CopperOre]: {
      count: 0,
      max: 50
    },

    [ResourceType.IronOre]: {
      count: 0,
      max: 50
    },

    [ResourceType.Stone]: {
      count: 0,
      max: 50
    },

    [ResourceType.Coal]: {
      count: 0,
      max: 50
    },

    [ResourceType.Copper]: {
      count: 0,
      max: 50
    },
    [ResourceType.Iron]: {
      count: 0,
      max: 50
    },
    [ResourceType.Steel]: {
      count: 0,
      max: 50
    },
    [ResourceType.StoneBricks]: {
      count: 0,
      max: 50
    },
    [ResourceType.IronGear]:{
      count: 0,
      max: 50
    },
    [ResourceType.CopperWire]: {
      count: 0,
      max: 50
    },

    [ResourceType.RedScience]: {
      count: 0,
      max: 50
    },
  };

  public resourceTransferer: ResourceTransferManager =
    new ResourceTransferManager(this.resourceInventory);

  public assemblers: Array<any> = [{}, {}, {}];

  public smelters: Array<any> = [
    {
      selectedRecipe: {
        resourceType: ResourceType.Iron,
        displayName: 'Iron',
      },
    },
    {
      selectedRecipe: {
        resourceType: ResourceType.Copper,
        displayName: 'Copper',
      },
    },
    {
      selectedRecipe: {
        resourceType: ResourceType.Steel,
        displayName: 'Steel',
      },
    },
  ];

  public miners: Array<any> = [1, 2, 3];

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

    {
      value: ResourceType.RedScience,
      name: 'Red Science',
    },
  ];

  public resourceContainers: Array<any> = [
    {
      displayName: 'Iron Ore',
      resourceType: ResourceType.IronOre,
    },

    {
      displayName: 'Copper Ore',
      resourceType: ResourceType.CopperOre,
    },
    {
      displayName: 'Coal',
      resourceType: ResourceType.Coal,
    },

    {
      displayName: 'Stone',
      resourceType: ResourceType.Stone,
    },

    {
      displayName: 'Iron',
      resourceType: ResourceType.Iron,
    },

    {
      displayName: 'Steel',
      resourceType: ResourceType.Steel,
    },

    {
      displayName: 'Copper',
      resourceType: ResourceType.Copper,
    },

    {
      displayName: 'Copper Wire',
      resourceType: ResourceType.CopperWire,
    },

    {
      displayName: 'Iron Gear',
      resourceType: ResourceType.IronGear,
    },

    {
      displayName: 'Red Science',
      resourceType: ResourceType.RedScience,
    },
  ];

  constructor(private recipeService: RecipeService, private commandService: CommandService) {
    
    commandService.registerCommand('inventory', 'manages inventory', (option: string) => { 

      switch (option) { 
        case 'fill': { 
          for (let key in this.resourceInventory) { 
            this.resourceInventory[key].count = 1000;
          } 
          break; 
        } 
        case 'empty': { 
          for (let key in this.resourceInventory) { 
            this.resourceInventory[key].count = 0;
          }  
          break;
        }
        default: { 
          alert(1)
        }
      }
    
   })


    

  }

  ngOnInit(): void {}
  onSelectionChanged() {}

  onClickResource(resourceType: ResourceType) {
    let clickValid: boolean = true;
    const recipe: Recipe = this.recipeService.findRecipe(resourceType);

    if (recipe) {
      if (this.canSatisfyRecipe(recipe)) {
        this.processResources(recipe);
      } else {
        clickValid = false;
      }
    } else {
      this.resourceInventory[resourceType].count += this.increment;
    }

    if (clickValid) {
      this.clickCount += this.increment;
      if (this.clickCount >= this.expToNextLevel) {
        this.currentLevel++;
        this.clickCount = 0;
        this.expToNextLevel *= 2.0;
      }
    }
  }

  canSatisfyRecipe(recipe: Recipe): boolean {
    for (const requiredResource of recipe.requiredResources) {
      const requiredAmount = requiredResource.count;
      const requiredResourceType = requiredResource.resourceType;
      const ownedResourceAmount =
        this.resourceInventory[requiredResourceType].count;
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
      this.resourceInventory[requiredResourceType].count -= requiredAmount;
    }
    this.resourceInventory[recipe.output.resourceType].count +=
      recipe.output.count;
  }
}
