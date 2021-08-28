import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Recipe } from 'src/factoryClicker/Recipe';
import { ReceipeResult } from 'src/factoryClicker/RecipeResult';
import { ResourceTransferManager } from 'src/factoryClicker/ResourceTransferManager';
import { ResourceType } from 'src/factoryClicker/ResourceType';
import { LoggerService } from '../logger/logger.service';
import { RecipeService } from '../services/RecipeService';

class Smelter {

  recipe?: Recipe;
  progress: number = 0;
  running: boolean = false;
  requiredResourceStore: any = {}
  normalizedProgress: number = 0;

  isRunning(): boolean {
    return this.running;
  }

  addResources(resourceType: ResourceType, amount: number, resourcePipe: ResourceTransferManager) {
    if (!this.requiredResourceStore[resourceType]) {
      this.requiredResourceStore[resourceType] = { count: 0 }
    }
    const result = resourcePipe.getFromSource(resourceType, amount);
    this.requiredResourceStore[resourceType].count += result.count;
  }

  ableToSmeltRecipe(recipe: Recipe) : boolean { 
    for (const resource of recipe.requiredResources) { 
      if (!this.requiredResourceStore[resource.resourceType] || this.requiredResourceStore[resource.resourceType].count < resource.count) { 
        return false;
      }
    }
    return true;
  }

  spendRecipeResources(recipe: Recipe) { 
    for (const resource of recipe.requiredResources) { 
      this.requiredResourceStore[resource.resourceType].count -= resource.count;
    }
  }
  
  initializeLocalInventory(recipe: Recipe) {
    for (const resource of recipe.requiredResources) { 
      this.requiredResourceStore[resource.resourceType] = {count: 0}
    }
  }

  restart() {
    if (this.recipe) { 
      this.running = true;
      this.normalizedProgress = 0;
      this.progress = 0;
    }
  }

  stop() {
    this.normalizedProgress = 0;
    this.running = false;
    this.progress = 0;   
  }

  tick(onRecipeComplete: any): void {
    if (this.recipe) {
      this.progress += 0.1;
      this.normalizedProgress = (this.progress / this.recipe.duration) * 100;

      if (this.progress >= this.recipe.duration) {
        onRecipeComplete(this.recipe.output)
      }
    }
  }

  startSmelting(newRecipe: Recipe, shouldLoop: boolean): Observable<ReceipeResult> | null { 

    if (!this.isRunning() && this.ableToSmeltRecipe(newRecipe)) {
      this.recipe = newRecipe;
      this.restart()
      this.spendRecipeResources(this.recipe)

      return new Observable((callbacks) => {   
        try { 
          const progressHandle = setInterval(() => {
            this.tick((result: ReceipeResult) => {
              callbacks.next(result)
              if (this.recipe) { 
                if (!this.ableToSmeltRecipe(this.recipe) || !shouldLoop) { 
                  this.stop();
                  callbacks.complete()
                  clearInterval(progressHandle);
                } else { 
                  this.spendRecipeResources(this.recipe)
                  this.restart()
                }
              }
            });
          }, 15);
        } catch (err: any) { 
          callbacks.error(err)
        } 
      });
    }
    return null
  }
}

@Component({
  selector: 'Smelter',
  templateUrl: './smelter.component.html',
  styleUrls: ['./smelter.component.sass'],
})
export class SmelterComponent implements OnInit, OnDestroy {
  
  @Input() resourceType?: ResourceType;
  @Input() resourceTransferer?: ResourceTransferManager;
  @Input() dropdownOptions?: Array<any>;

  selectedResourceType: ResourceType = ResourceType.None;
  smelter: Smelter = new Smelter();
  loop: boolean = false;
  outputCount: number = 0;
  listener: any = null;
  activeRecipe?: Recipe;
  recipeSet: boolean = false;

  constructor(private recipeService: RecipeService, private logger: LoggerService) {}
  
  smeltingCallbacks = {
    // called when a recipe is complete
    next: (result: ReceipeResult) => this.onSmeltingComplete(result),

    // called when a recipe is complete and we're not able to smelt another recipe
    complete: () => this.onSmeltingStopped(),

    // called on error
    error: (err: any) => this.onSmeltingError(err)
  };

  flushOuput() { 
      if (this.activeRecipe) {
        this.resourceTransferer?.sendToSource(this.activeRecipe?.output)
      }
      this.outputCount = 0;
  }

  onAddRequiredResource(resourceType: ResourceType) {
    if (this.resourceTransferer) { 
      this.smelter.addResources(resourceType, 1, this.resourceTransferer) 
    }
  }

  onSmeltingComplete(results: ReceipeResult) { 
    this.outputCount += results.count;
  }

  onRecipeSelectionChanged() { 
    this.recipeSet = false;
    if (this.selectedResourceType) { 
      this.activeRecipe = this.recipeService.findRecipe(this.selectedResourceType);
      if (this.activeRecipe) { 
        this.smelter.initializeLocalInventory(this.activeRecipe)
        this.recipeSet = true;
      } 
    } 
  }

  onSmeltingStopped() { 
    if (this.listener) { 
      this.listener.unsubscribe();
    }
  }

  onSmeltingError(error: any) {
    this.logger.error('Smeltercomponent', 'onSmeltingError', error.toString());
  }

  startSmelter(): void {
    if (this.activeRecipe){
      const observable = this.smelter.startSmelting(this.activeRecipe, this.loop);
      if (observable) { 
        this.listener = observable.subscribe(this.smeltingCallbacks)
      }
    }
  }

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    if (this.listener){
      this.listener.unsubscribe();
    }
  }

  
}
