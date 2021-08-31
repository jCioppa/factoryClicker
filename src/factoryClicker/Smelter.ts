import { LoggerService } from "src/app/logger/logger.service";
import { Recipe } from "./Recipe";
import { ResourceType } from "./ResourceType";

class CoalBuffer { 
  count: number;
  max: number;

  constructor(count: number, max: number) { 
    this.count = count;
    this.max = max;
  }

  add(amount: number) { 
    this.count  = Math.min(this.max, this.count + amount);
  }

  remove(amount: number) { 
    this.count  = Math.max(0, this.count - amount);
  }

  empty() : boolean { 
    return this.count === 0;
  }
}

class PowerSource { 

  currentPower: number;
  maxPower: number;
  normalizedPower: number;

  constructor(current: number, max: number) { 
    this.currentPower = current;
    this.maxPower = max;
    this.normalizedPower = 100 * (this.currentPower / this.maxPower)
  }

  empty(): boolean { 
    return this.currentPower === 0;
  }

  addPower(amount: number) { 
      this.currentPower = Math.min(this.maxPower, this.currentPower + amount);
      this.normalizedPower = 100 * (this.currentPower / this.maxPower)
  }

  usePower(amount: number) { 
    this.currentPower = Math.max(0, this.currentPower - amount);
    this.normalizedPower = 100 * (this.currentPower / this.maxPower)
  }
}

export class Smelter {

    resourceStore: any = {}
    normalizedProgress: number = 0;
    recipe?: Recipe;
    progress: number = 0;
    running: boolean = false;
    blocked: boolean = false;

    coalBuffer: CoalBuffer = new CoalBuffer(0, 10)
    powerSource: PowerSource = new PowerSource(0, 10)
    powerPerCoal: number = 4;
  
    outputBuffer: any = {
      count: 0,
      max: 50
    }
  
    loop: boolean = true;  
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
  
    startRecipe() {
  
    }
  
    addToStore(resourceType: ResourceType, amount: number) { 
      if (this.resourceStore[resourceType]) { 
        const newAmount = amount + this.resourceStore[resourceType].count;
        this.resourceStore[resourceType].count = Math.max(newAmount, this.resourceStore[resourceType].count);
      }
    }

    ableToBuildRecipe(recipe: Recipe) : boolean { 
      let ableToBuild = true;
      if (this.recipe) { 
        for (const resource of this.recipe.requiredResources) { 
          const currentAmount = this.resourceStore[resource.resourceType].count;
          const requiredAmount = resource.count;
          if (currentAmount < requiredAmount) { 
            ableToBuild = false;
            break;
          }
        }
      }

      return ableToBuild;
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
        this.powerSource.usePower(0.05);
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
        this.coalBuffer.add(amount)
    }
  
    consumeFuel(): void {
      if (this.powerSource.empty() && !this.coalBuffer.empty()) { 
          this.coalBuffer.remove(1)
          this.powerSource.addPower(this.powerPerCoal);
      }
    }
  }
