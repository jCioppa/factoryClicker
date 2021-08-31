import { LoggerService } from "src/app/logger/logger.service";
import { Recipe } from "./Recipe";

export class Miner {

    normalizedPower: number = 0;
    normalizedProgress: number = 0;
    recipe?: Recipe;
    progress: number = 0;
    running: boolean = false;
    blocked: boolean = false;
    coalBuffer: any = { count: 0, max: 10 }
    maxPower: number = 10;
    power: number = 0;   
    powerPerCoal: number = 10;
  
    outputBuffer: any = {
      count: 0,
      max: 50
    }
  
    loop: boolean= true;  
    logger: LoggerService;
  
    constructor(logger: LoggerService) { 
      this.logger = logger;
    }
  
    updateProgress() { 
      if (this.recipe){
        this.progress += 0.1;
        this.normalizedProgress = (this.progress / this.recipe?.duration) * 100;
      }
    }
  
    restart() {
  
    }
  
    ableToBuildRecipe(recipe: Recipe) : boolean { 
      for (const resource of recipe.requiredResources) { 
          const required = resource.count;
          const available = this.outputBuffer[resource.resourceType].count;
          if (required > available) { 
              return false;
          }
      }        
      return true;
    }
  
    completeRecipe() { 
      if (this.recipe) { 
        this.outputBuffer.count = Math.min( this.outputBuffer.count + this.recipe.output.count, this.outputBuffer.max)
        this.progress = 0;
        this.normalizedProgress = 0;
      }
    }
  
    updatePower() { 
      if (this.recipe){
        this.power = Math.max(this.power - 0.05, 0)
        this.normalizedPower = (this.power / this.maxPower) * 100;
      }
    }
  
    hasCompletedRecipe() { 
      return this.recipe && (this.progress > this.recipe?.duration);          
    }
  
    getAllOutput(): any {
      const result = {
        resourceType: this.recipe?.output.resourceType,
        count: this.outputBuffer.count
      }
      this.outputBuffer.count = 0;
      return result;
    }
  
    setRecipe(recipe: Recipe) { 
      this.recipe = recipe;
    }
  
    stop() {
      this.running = false;
    }
  
    addCoal(amount: number) {
        this.coalBuffer.count = Math.min(this.coalBuffer.count + amount, this.coalBuffer.max)
    }
  
    consumeFuel(): void {
      if (this.power <= 0 && this.coalBuffer.count > 0) { 
          this.coalBuffer.count -= 1;
          this.power += this.powerPerCoal;
      }
      this.normalizedPower = 100 * (this.power / this.maxPower);
    }
  }
