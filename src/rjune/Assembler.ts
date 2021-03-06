import { ResourceType } from 'src/rjune/ResourceType';
import { Recipe } from './Recipe';
import { RecipeMap } from './data/RecipeMap';
import { ReceipeResult } from './RecipeResult';
import { ResourceTransferManager } from 'src/app/rjune-game/rjune-game.component';

export class Assembler {
  recipe?: Recipe;
  progress: number = 0;
  progressHandle: any = null;

  recipeName(): string {
    return this.recipe ? this.recipe.name : 'NONE';
  }

  start(recipe: ResourceType, resourceTransferer: ResourceTransferManager) {
    if (this.isRunning()) {
      this.stop();
    }

    if (recipe !== ResourceType.None) {
      const newRecipe = RecipeMap[recipe];
      console.log(newRecipe);
      if (resourceTransferer.satisfiesRecipe(newRecipe)) {
        console.log(1);
        const requiredResources =
          resourceTransferer.transferResources(newRecipe);
        this.recipe = newRecipe;
        this.progressHandle = setInterval(
          () => this.tick(),
          newRecipe.duration
        );
      }
    }
  }

  stop() {
    if (this.progressHandle !== null) {
      clearInterval(this.progressHandle);
      this.progressHandle = null;
      this.progress = 0;
    }
  }

  isRunning(): boolean {
    return !(this.progressHandle === null);
  }

  tick(): ReceipeResult | null {
    if (this.recipe) {
      this.progress++;
      if (this.progress >= this.recipe.duration) {
        this.stop()
        return this.recipe.output;
      }
    }
    return null;
  }
}
