import { Observable } from "rxjs";
import { StateMachine } from "../smelter/StateMachine";
import { Assembler } from "./Assembler";

export interface AssemblerStateChange {

}

enum AssemblerStateValues { 
  Idle = "Idle",
  Starting = "Starting",
  Restarting = "Restarting",
  RecipeStarted = "RecipeStarted",
  Running = "Running",
  RecipeComplete = "RecipeComplete",
  Stopping = "Stopping", 
  Stopped = "Stopped",
}

export class AssemblerState extends StateMachine<AssemblerStateChange, AssemblerStateValues> { 
  
  assembler: Assembler;
  context: any = null;

  constructor(assembler: Assembler, updateRate: number, context: any) { 
    super(updateRate)
    this.assembler = assembler;
    this.updateRate = updateRate
    this.context = context;
  }

  start(): any { 
    return this.startInternal(AssemblerStateValues.Starting);
  }
  
  stop() : void { 
    this.stopInternal(AssemblerStateValues.Stopping);
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

      case AssemblerStateValues.Starting: { 
        this.changeState(AssemblerStateValues.RecipeStarted)
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
