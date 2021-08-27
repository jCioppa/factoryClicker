import { ReceipeResult } from './RecipeResult';
import { RequiredResourceInfo } from './RequiredResourceInfo';

/// represents a recipe we can make in an assembler
export interface Recipe {
  name: string;
  duration: number;
  requiredResources: Array<RequiredResourceInfo>;
  output: ReceipeResult;
}
