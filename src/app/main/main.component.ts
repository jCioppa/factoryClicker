import { Component, OnInit } from '@angular/core';
import { Recipe } from 'src/factoryClicker/Recipe';
import { ResourceInventory } from 'src/factoryClicker/ResourceInventory';
import {  ResourceTransferManager } from 'src/factoryClicker/ResourceTransferManager';
import { ResourceType } from '../../factoryClicker/ResourceType';
import { CommandService } from '../services/CommandService';
import { RecipeService } from '../services/RecipeService';

// these are options in the recipe dropdown, and isn't used outside this class
interface RecipeOptionInfo {
  value: ResourceType;
  name: string;
}


const min = (a:number, b:number):number => { 
  return (a <= b) ? a : b;
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

  researchCenters: Array<any> = [1,2,3,4,5,6]

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

  public resourceInventory: ResourceInventory = new ResourceInventory()

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
           this.resourceInventory.fill()
          break; 
        }        
        default: { 
          
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
      if (this.ableToBuildRecipe(recipe)) {
        this.buildRecipe(recipe);
      } else {
        clickValid = false;
      }
    } else {
      this.resourceInventory.add(resourceType, this.increment)
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

  ableToBuildRecipe(recipe: Recipe): boolean {
    for (const requiredResource of recipe.requiredResources) {
      if (!this.resourceInventory.ableToRemove(requiredResource.resourceType, requiredResource.count)) {
        return false;
      }
    }
    return true;
  }

  buildRecipe(recipe: Recipe) {
    if (this.resourceInventory.ableToAdd(recipe.output.resourceType, recipe.output.count)) {
      for (const requiredResource of recipe.requiredResources) {
        const requiredAmount = requiredResource.count;
        const requiredResourceType = requiredResource.resourceType;
        this.resourceInventory.remove(requiredResourceType, requiredAmount)
      }
      this.resourceInventory.add(recipe.output.resourceType, recipe.output.count)
    }
  }
}
