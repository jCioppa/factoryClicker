import { Observable } from 'rxjs';
import { Recipe } from './Recipe';
import { ReceipeResult } from './RecipeResult';
import { ResourceQuery, ResourceTransferManager } from './ResourceTransferManager';

export class Assembler {
  recipe?: Recipe;
  progress: number = 0;
  running: boolean = false;

  requiredResourceStore: any = {

  }

  addToStore(query: ResourceQuery) { 
    if (!this.requiredResourceStore[query.resourceType]) {
      this.requiredResourceStore[query.resourceType] = {count: 0}
    }
    this.requiredResourceStore[query.resourceType].count += query.count;
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
      this.restart()
    
      return new Observable((callbacks) => {   
        try { 
          const progressHandle = setInterval(() => {
            this.tick((result: ReceipeResult) => {
              callbacks.next(result)
              if (this.recipe) { 
                if (!this.ableToBuildRecipe(this.recipe) || !shouldLoop) { 
                  this.stop();
                  clearInterval(progressHandle);
                  callbacks.complete()
                } else { 
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

  restart() {
    if (this.recipe) { 
      this.spendRecipeResources(this.recipe)
      this.progress = 0;
      this.running = true;
    }
  }

  stop() {
    this.progress = 0;
    this.running = false;
  }

  isRunning(): boolean {
    return this.running;
  }

  tick(onRecipeComplete: any): void {
    if (this.recipe) {
      this.progress += 0.1;
      if (this.progress >= this.recipe.duration) {
        onRecipeComplete(this.recipe.output)
      }
    }
  }
}