import {  Observable } from 'rxjs';
import { AssemblerState } from './AssemblerState';
import { Recipe } from './Recipe';
import { ReceipeResult } from './RecipeResult';
import { ResourceQuery, ResourceTransferManager } from './ResourceTransferManager';
import { ResourceType } from './ResourceType';

export class Assembler {
  
  recipe?: Recipe;
  progress: number = 0;
  running: boolean = false;
  state?: AssemblerState;
  requiredResourceStore: any = {}
 
  addToStore(resourceType: ResourceType, count: number) { 
    if (!this.requiredResourceStore[resourceType]) {
      this.requiredResourceStore[resourceType] = {count: 0}
    }
    this.requiredResourceStore[resourceType].count += count;
  }

  initializeInventory(newRecipe: Recipe) { 
    for (const resource of newRecipe.requiredResources) { 
        this.requiredResourceStore[resource.resourceType] = { count: 0 }
    }
  }

  ableToBuildRecipe(recipe: Recipe): boolean { 
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

  startAssembling(newRecipe: Recipe, shouldLoop: boolean): Observable<ReceipeResult> | null { 
    if (!this.isRunning() && this.ableToBuildRecipe(newRecipe)) {
      this.recipe = newRecipe;
      this.state = new AssemblerState(this, 10, {
          progressPerTick: 0.1,
          updateRate: 20
        });
      return this.state.start()
    }
    return null
  }

  restart() {
    if (this.recipe) { 
      this.spendRecipeResources(this.recipe)
      this.progress = 0;
      this.running = true;
    }
  }

  hasCompletedRecipe(): boolean { 
    if (this.recipe) { 
      return this.progress >= this.recipe.duration;
    }
    return false;
  }

  stop() {
    this.progress = 0;
    this.running = false;
  }

  isRunning(): boolean {
    return this.running;
  }
}