import { Observable } from "rxjs";
import { Assembler } from "./Assembler";
import { Recipe } from "./Recipe";

export interface AssemblerStateChange {

}

enum AssemblerStateValues { 
  RecipeStarted,
  Running, 
  RecipeComplete,
  Restarting,
  Stopping, 
  Stopped,
  Idle
}

interface IAssembler { 
  recipe?: Recipe;
  progress: number;
  restart(): void;
  hasCompletedRecipe(): boolean;
  ableToBuildRecipe(recipe: Recipe): boolean;
  stop(): void;
}

export class AssemblerState { 
  
  engine?: Observable<AssemblerStateChange>;
  handle?: any;
  updateRate: number = 0;
  currentState: AssemblerStateValues = AssemblerStateValues.Stopped;
  assembler: Assembler;
  context: any = null;

  constructor(assembler: Assembler, updateRate: number, context: any) { 
    this.assembler = assembler;
    this.updateRate = updateRate
    this.context = context;
  }

  start(): any { 
    this.currentState = AssemblerStateValues.RecipeStarted;
    this.engine = new Observable<AssemblerStateChange>((observer: any) => { 
      this.handle = setInterval(() => this.run(observer), this.updateRate)
    })
    return this.engine;
  }
  
  run(observer: any) { 

    switch(this.currentState) {

      case AssemblerStateValues.Idle: { 

      } break;

       // @NextState (Running)
      case AssemblerStateValues.RecipeStarted: { 
        this.assembler.restart();
        if (this.assembler.running) { 
          this.currentState = AssemblerStateValues.Running;
        } else { 
          this.currentState = AssemblerStateValues.Idle;
        }
      } break;

       // @NextState (Running | RecipeComplete)
      case AssemblerStateValues.Running: { 
        this.assembler.progress += this.context.progressPerTick;
        if (this.assembler.hasCompletedRecipe()) {
            this.currentState = AssemblerStateValues.RecipeComplete;       
        }
      } break;

      // @NextState (Restarting | Stopping)
      case AssemblerStateValues.RecipeComplete: { 
        if (this.assembler.recipe) { 
            // notify all listeners that the recipe is complete
            observer.next(this.assembler.recipe.output)     
          
            this.currentState = 
              this.assembler.ableToBuildRecipe(this.assembler.recipe) ? 
                AssemblerStateValues.Restarting : 
                AssemblerStateValues.Stopping;
          }
      } break;

      // @NextState (RecipeStarted)
      case AssemblerStateValues.Restarting: { 
          this.currentState = AssemblerStateValues.RecipeStarted;
      } break;

      case AssemblerStateValues.Stopping: { 
        this.assembler.stop();
        clearInterval(this.handle);
        this.currentState = AssemblerStateValues.Stopped;
      } break;
      
      case AssemblerStateValues.Stopped: { 
        observer.complete()
      }
    }         
  }
}
