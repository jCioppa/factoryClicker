import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Assembler } from 'src/factoryClicker/Assembler';
import { Recipe } from 'src/factoryClicker/Recipe';
import { ReceipeResult } from 'src/factoryClicker/RecipeResult';
import { ResourceQuery, ResourceTransferManager } from 'src/factoryClicker/ResourceTransferManager';
import { ResourceType } from '../../factoryClicker/ResourceType';
import { LoggerService } from '../logger/logger.service';
import { CommandService } from '../services/CommandService';
import { RecipeService } from '../services/RecipeService';

interface RecipeOptionInfo {
  value: ResourceType;
  name: string;
}

@Component({
  selector: 'Assembler',
  templateUrl: './assembler.component.html',
  styleUrls: ['./assembler.component.sass'],
})
export class AssemblerComponent implements OnInit, OnDestroy {
  @Input() inventoryPipe?: ResourceTransferManager;

  assembler: Assembler = new Assembler();
  activeRecipe?: Recipe;
  selectedOption?: ResourceType;
  
  recipeSet: boolean = false;
  duration: number = 0;
  progress: number = 0;
  outputCount: number = 0;
  loop: boolean = false;  

  public availableRecipes: Array<RecipeOptionInfo> = [
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

  constructor(
    private logger: LoggerService,
    private commandService: CommandService,
    private recipeService: RecipeService
  ) {
      
  }

  pushOutputToSource() { 
    if (this.activeRecipe) { 
      this.inventoryPipe?.returnResource(this.activeRecipe.output.resourceType, this.outputCount);
      this.outputCount = 0;
    }
  }

  // called when the dropdown option changes
  onRecipeChanged() { 
    if (this.selectedOption) {
      this.activeRecipe = this.recipeService.findRecipe(this.selectedOption); 
      if (this.activeRecipe) {
        this.recipeSet = true;
        this.assembler.initializeInventory(this.activeRecipe);
      } else { 
        this.recipeSet = false;
      }
    }
  }

  assemblerProgress(): number { 
    return !(this.assembler && this.assembler && this.assembler.recipe) ? 0 : 
         100 * (this.assembler.progress / this.assembler.recipe.duration);
  }

  getAvailableResourceCount(resourceType: ResourceType): number { 
    const result: number = this.assembler.requiredResourceStore[resourceType].count;
    return result ?? 0;
  }

  assemblerCallbacks = {
    // called when a recipe is complete
    next: (result: ReceipeResult) => this.onRecipeComplete(result),

    // called when a recipe is complete and we're not able to build another recipe
    complete: () => this.onAssemblingComplete(),

    // called on error
    error: (err: any) => this.onAssemblingError(err)
  };

  listener?: Subscription;

  startAssembler(): void {
    if (this.recipeSet &&  this.activeRecipe && this.inventoryPipe) {
      const observable = this.assembler.startAssembling(this.activeRecipe, this.loop);
      if (observable) { 
        this.listener = observable.subscribe(this.assemblerCallbacks)
      }
    }
  }

  onRecipeComplete(result: ReceipeResult) { 
    this.outputCount += result.count;
  }

  onAssemblingError(error: any) {
    this.logger.error('AssemblerComponent', 'onAssemblingError', error.toString());
  }

  onAssemblingComplete() { 
    if (this.listener) { 
      this.listener.unsubscribe();
    }
  }

  transferRequiredResource(resourceType: ResourceType) {
    const result: any = this.inventoryPipe?.getFromSource(resourceType, 1);
    this.assembler.addToStore(result);
  }

  ngOnDestroy(): void {
    this.onAssemblingComplete()  
  }

  ngOnInit(): void {}
}
