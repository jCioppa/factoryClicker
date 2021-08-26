import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from 'src/factoryClicker/Recipe';
import { ResourceTransferManager } from 'src/factoryClicker/ResourceTransferManager';
import { ResourceType } from 'src/factoryClicker/ResourceType';
import { RecipeService } from '../services/RecipeService';

class Smelter {
  recipe?: Recipe;
  progress: number = 0;
  duration: number = 0;
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
      this.duration = newRecipe.duration;
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

@Component({
  selector: 'Smelter',
  templateUrl: './smelter.component.html',
  styleUrls: ['./smelter.component.sass'],
})
export class SmelterComponent implements OnInit {
  @Input() resourceType?: ResourceType;
  @Input() resourceTransferer?: ResourceTransferManager;
  @Input() dropdownOptions?: Array<any>;
  selectedResourceType: ResourceType = ResourceType.None;
  smelter: Smelter = new Smelter();

  constructor(private recipeService: RecipeService) {}

  startSmelter(): void {
    if (this.resourceTransferer && this.resourceType) {
      const recipe = this.recipeService.findRecipe(this.resourceType);
      this.smelter.start(recipe, this.resourceTransferer);
    }
  }

  ngOnDestroy(): void {}

  ngOnInit(): void {}
}
