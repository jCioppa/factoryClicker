import { Component, Input, OnInit } from '@angular/core';
import { RecipeMap } from 'src/factoryClicker/data/RecipeMap';
import { Recipe } from 'src/factoryClicker/Recipe';
import { ResourceTransferManager } from 'src/factoryClicker/ResourceTransferManager';
import { ResourceType } from 'src/factoryClicker/ResourceType';

class Smelter {
  recipe?: Recipe;
  progress: number = 0;
  duration: number = 0;
  progressHandle: any = null;

  recipeName(): string {
    return this.recipe ? this.recipe.name : 'NONE';
  }

  start(
    resourceType: ResourceType,
    resourceTransferer: ResourceTransferManager
  ) {
    if (this.isRunning()) {
      this.stop();
    }
    if (resourceType !== ResourceType.None) {
      const newRecipe = RecipeMap[resourceType];
      if (resourceTransferer.satisfiesRecipe(newRecipe)) {
        resourceTransferer.transferResources(newRecipe);
        this.recipe = newRecipe;
        this.duration = newRecipe.duration;
        this.progressHandle = setInterval(
          () => this.tick(resourceTransferer),
          newRecipe.duration
        );
      }
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
        resourceTransferer.returnResources(result);
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

  startSmelter(): void {
    if (this.resourceTransferer && this.resourceType) {
      this.smelter.start(this.resourceType, this.resourceTransferer);
    }
  }

  ngOnDestroy(): void {}

  ngOnInit(): void {}
}
