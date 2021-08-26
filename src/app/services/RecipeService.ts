import { Injectable } from '@angular/core';
import { RecipeMap } from 'src/factoryClicker/data/RecipeMap';
import { Recipe } from 'src/factoryClicker/Recipe';
import { ResourceType } from 'src/factoryClicker/ResourceType';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class RecipeService {
  constructor(private logger: LoggerService) {}
  findRecipe(resourceType: ResourceType): Recipe {
    return RecipeMap[resourceType];
  }
}
