import { Observable } from "rxjs";
import { LoggerService } from "src/app/logger/logger.service";
import { Miner } from "./Miner";

export interface MinerStateChange {

}
enum MinerStateValues { 
  Starting = "Starting",
  RecipeStarted = "RecipeStarted",
  Running = "Running", 
  RecipeComplete = "RecipeCompleted",
  Restarting = "Restarting",
  Stopping = "Stopping",
  Stopped = "Stopped",
  Idle = "Idle"
}


export class MinerState { 
  
  engine?: Observable<MinerStateChange>;
  handle?: any;
  updateRate: number = 0;
  currentState: MinerStateChange = MinerStateValues.Stopped;
  miner: Miner;
  context: any = null;
  logger: LoggerService;

  constructor(miner: Miner, updateRate: number, context: any, logger: LoggerService) { 
    this.miner = miner;
    this.updateRate = updateRate
    this.context = context;
    this.logger = logger
  }

  changeState(newState: MinerStateValues) { 
    this.logger.log('MinerState', 'changeState', `${this.currentState} => ${newState}`)
    this.currentState = newState;
  }

  start(): any { 
    this.changeState(MinerStateValues.Starting);
    if (!this.engine) { 
      this.engine = new Observable<MinerStateChange>((observer: any) => { 
        this.handle = setInterval(() => this.run(observer), this.updateRate)
      })
    }
    return this.engine;
  }
  
  run(observer: any) { 
    switch(this.currentState) {

      case MinerStateValues.Starting: {
        if (this.miner.power > 0) { 
          this.changeState(MinerStateValues.RecipeStarted);
        } else { 
          this.miner.consumeFuel();
        }
      } break;

      case MinerStateValues.Idle: { 

      } break;

       // @NextState (Running)
      case MinerStateValues.RecipeStarted: { 
        this.miner.restart();
        if (this.miner.running) { 
          this.changeState(MinerStateValues.Running);
        } else { 
          this.changeState(MinerStateValues.Idle);
        }
      } break;

       // @NextState (Running | RecipeComplete)
      case MinerStateValues.Running: {         
        if (this.miner.power <= 0) {
          this.changeState(MinerStateValues.Idle);
        } else { 

          this.miner.updateProgress();
          this.miner.updatePower();
          this.miner.consumeFuel();

          if (this.miner.hasCompletedRecipe()) { 
            this.miner.completeRecipe();
            this.changeState(MinerStateValues.RecipeComplete);
          }
        }
      } break;

      // @NextState (Restarting | Stopping)
      case MinerStateValues.RecipeComplete: { 
        if (this.miner.recipe) { 
            // notify all listeners that the recipe is complete
            observer.next(this.miner.recipe.output)     
          
            this.changeState(
              this.miner.ableToBuildRecipe(this.miner.recipe) ? 
                MinerStateValues.Restarting : 
                MinerStateValues.Stopping);
          }
      } break;

      // @NextState (RecipeStarted)
      case MinerStateValues.Restarting: { 
        this.changeState(MinerStateValues.RecipeStarted);
      } break;

      case MinerStateValues.Stopping: { 
        this.miner.stop();
        clearInterval(this.handle);
        this.changeState(MinerStateValues.Stopped);
      } break;
      
      case MinerStateValues.Stopped: { 
        observer.complete()
      }
    }         
  }
}
