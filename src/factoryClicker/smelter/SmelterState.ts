import { Observable } from "rxjs";
import { LoggerService } from "src/app/logger/logger.service";
import { Smelter } from "./Smelter";
import { StateMachine } from "./StateMachine";

export interface SmelterStateChange {

}

enum SmelterStateValues { 
  Starting = "Starting",
  RecipeStarted = "RecipeStarted",
  Running = "Running", 
  RecipeComplete = "RecipeCompleted",
  Restarting = "Restarting",
  Stopping = "Stopping",
  Stopped = "Stopped",
  Idle = "Idle"
}

export class SmelterState extends StateMachine<SmelterStateChange, SmelterStateValues> {

  smelter: Smelter;
  logger: LoggerService;
  context: any;

  constructor(miner: Smelter, updateRate: number, context: any, logger: LoggerService) { 
    super(updateRate)
    this.smelter = miner;
    this.updateRate = updateRate
    this.logger = logger
    this.context = context;
  }

  start(): Observable<SmelterStateChange> { 
    return this.startInternal(SmelterStateValues.Starting);
  }

  stop(): void { 
    this.stopInternal(SmelterStateValues.Stopping);
  }
  
  run(observer: any) { 
    switch(this.currentState) {

      case SmelterStateValues.Idle: { 
        this.smelter.consumeFuel();
        if (!this.smelter.powerSource.empty()) { 
          this.changeState(SmelterStateValues.Starting);        
        }
      } break;

      case SmelterStateValues.Starting: {
          if (!this.smelter.powerSource.empty()) { 
              this.changeState(SmelterStateValues.RecipeStarted);        
          } else { 
            this.smelter.consumeFuel();
          }
      } break;

       // @NextState (Running)
      case SmelterStateValues.RecipeStarted: { 
        this.smelter.startRecipe();      
        this.changeState(SmelterStateValues.Running);
      } break;

       // @NextState (Running | RecipeComplete)
      case SmelterStateValues.Running: {         
        if (this.smelter.powerSource.empty()) {
          this.changeState(SmelterStateValues.Idle);
        } else {
          this.smelter.updateProgress(this.context.progressPerTick);
          this.smelter.updatePower();
          this.smelter.consumeFuel(); 
          if (this.smelter.hasCompletedRecipe()) { 
            this.smelter.completeRecipe();
            this.changeState(SmelterStateValues.RecipeComplete)  
          } 
        }
      } break;

      // @NextState (Restarting | Stopping | RecipeComplete)
      case SmelterStateValues.RecipeComplete: { 
        if (this.smelter.recipe) { 
          observer.next(this.smelter.recipe.output)     
          this.changeState(
            this.smelter.ableToBuildRecipe(this.smelter.recipe) ? 
              SmelterStateValues.Restarting : 
              SmelterStateValues.Stopping);
        } 
      } break;

      // @NextState (RecipeStarted)
      case SmelterStateValues.Restarting: { 
        this.changeState(SmelterStateValues.RecipeStarted);
      } break;

      case SmelterStateValues.Stopping: { 
        this.smelter.stop();
        this.changeState(SmelterStateValues.Stopped);
      } break;
      
      case SmelterStateValues.Stopped: { 
        clearInterval(this.handle);
        observer.complete()
      }

    }         
  }
}