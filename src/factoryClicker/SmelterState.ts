import { Observable } from "rxjs";
import { LoggerService } from "src/app/logger/logger.service";
import { Smelter } from "./Smelter";

const assert = (value: any, msg: string) => { 
  if (!value) { 
    throw new Error(msg)
  }
}

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

export class SmelterState { 
  
  engine?: Observable<SmelterStateChange>;
  handle?: any;
  updateRate: number = 0;
  currentState: SmelterStateValues = SmelterStateValues.Stopped;
  smelter: Smelter;
  context: any = null;
  logger: LoggerService;

  constructor(miner: Smelter, updateRate: number, context: any, logger: LoggerService) { 
    this.smelter = miner;
    this.updateRate = updateRate
    this.context = context;
    this.logger = logger
  }

  changeState(newState: SmelterStateValues) { 
    this.logger.log('MinerState', 'changeState', `${this.currentState} => ${newState}`)
    this.currentState = newState;
  }

  start(): any { 
    this.changeState(SmelterStateValues.Starting);
    if (!this.engine) { 
      this.engine = new Observable<SmelterStateChange>((observer: any) => { 
        this.handle = setInterval(() => this.run(observer), this.updateRate)
      })
    }
    return this.engine;
  }
  
  run(observer: any) { 
    switch(this.currentState) {

      case SmelterStateValues.Idle: { 

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
        this.smelter.restart();
        if (this.smelter.running) { 
          this.changeState(SmelterStateValues.Running);
        } else { 
          this.changeState(SmelterStateValues.Idle);
        }
      } break;

       // @NextState (Running | RecipeComplete)
      case SmelterStateValues.Running: {         
        if (this.smelter.powerSource.empty()) {
          this.changeState(SmelterStateValues.Idle);
        } else { 

          this.smelter.updateProgress();
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
        clearInterval(this.handle);
        this.changeState(SmelterStateValues.Stopped);
      } break;
      
      case SmelterStateValues.Stopped: { 
        observer.complete()
      }
    }         
  }
}
