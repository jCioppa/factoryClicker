import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Assembler } from 'src/factoryClicker/assembler/Assembler';
import { Recipe } from 'src/factoryClicker/Recipe';
import { ReceipeResult } from 'src/factoryClicker/RecipeResult';
import { ResourceTransferManager } from 'src/factoryClicker/ResourceTransferManager';
import { ResourceType } from 'src/factoryClicker/ResourceType';
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

  debug: boolean = false;
  assembler: Assembler = new Assembler();
  activeRecipe?: Recipe;
  selectedOption?: ResourceType;
  listener?: Subscription;
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
    if (this.activeRecipe && this.inventoryPipe) { 
      const amountSent: number = this.inventoryPipe.pushResources(this.activeRecipe.output.resourceType, this.outputCount);
      this.outputCount -= amountSent;
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

  startAssembler(): void {
    if (this.recipeSet &&  this.activeRecipe && this.inventoryPipe) {
      const observable = this.assembler.startAssembling(this.activeRecipe, this.loop);
      if (observable) { 
        this.listener = observable.subscribe((result: ReceipeResult) => this.onRecipeComplete(result), (err: any) => this.onAssemblingError(err), () => this.onAssemblingComplete())
      }
    }
  }

  getAssemblerState() { 
    if (!this.assembler.state) { 
      throw new Error('invalid assembler')
    }
    return this.assembler.state.currentState;
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
    if (this.inventoryPipe) { 
      const amountFetched: number = this.inventoryPipe.getResources(resourceType, 1);
      if (amountFetched > 0) { 
        this.assembler.addToStore(resourceType, amountFetched);
        this.startAssembler()
      }
    }
  }

  ngOnDestroy(): void {
    this.onAssemblingComplete()  
  }

  ngOnInit(): void {}

}
