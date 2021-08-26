import { ResourceType } from 'src/factoryClicker/ResourceType';
import { Recipe } from './Recipe';
import { ResourceTransferManager } from './ResourceTransferManager';

export class Assembler {
  recipe?: Recipe;
  progress: number = 0;
  progressHandle: any = null;

  recipeName(): string {
    return this.recipe ? this.recipe.name : 'NONE';
  }

  start(newRecipe: Recipe, resourceTransferer: ResourceTransferManager) {
    if (this.isRunning()) {
      this.stop();
    }
    if (resourceTransferer.satisfiesRecipe(newRecipe)) {
      resourceTransferer.transferRequiredRecipeResources(newRecipe);
      this.recipe = newRecipe;
      this.progressHandle = setInterval(
        () => this.tick(resourceTransferer),
        newRecipe.duration
      );
    }
  }

  stop() {
    if (this.progressHandle !== null) {
      clearInterval(this.progressHandle);
      this.progress = 0;
      this.progressHandle = null;
    }
  }

  isRunning(): boolean {
    return !(this.progressHandle === null);
  }

  tick(resourceTransferer: ResourceTransferManager): void {
    if (this.recipe) {
      this.progress++;
      if (this.progress >= this.recipe.duration) {
        this.stop();
        const result = this.recipe.output;
        resourceTransferer.returnRecipeResult(result);
      }
    }
  }
}
