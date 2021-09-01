import { Injectable } from '@angular/core';
import { RecipeMap, MinerRecipes } from 'src/factoryClicker/data/RecipeMap';
import { Recipe } from 'src/factoryClicker/Recipe';
import { ResourceType } from 'src/factoryClicker/ResourceType';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class RecipeService {
  constructor(private logger: LoggerService) {}

  findRecipe(resourceType: ResourceType): Recipe {
    const recipe =  RecipeMap[resourceType];
    return recipe
  }

  findMiningRecipe(resourceType: ResourceType): any {
    const recipe = MinerRecipes.find((recipe: any) => {
      return recipe.resourceType == resourceType;
    });

    return recipe ?? null;
  }
}
