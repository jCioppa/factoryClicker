import { Observable } from "rxjs";
import { LoggerService } from "src/app/logger/logger.service";
import { StateMachine } from "../smelter/StateMachine";
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

export class MinerState extends StateMachine<MinerStateChange, MinerStateValues> { 
  
  miner: Miner;
  logger: LoggerService;
  context: any;

  constructor(miner: Miner, updateRate: number, context: any, logger: LoggerService) { 
    super(updateRate)
    this.miner = miner;
    this.context = context;
    this.logger = logger
  }

  start(): Observable<MinerStateChange> { 
    return this.startInternal(MinerStateValues.Starting);
  }

  stop(): any { 
    return this.stopInternal(MinerStateValues.Stopping);
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
        this.miner.consumeFuel();
        if (this.miner.power > 0) {
          this.changeState(MinerStateValues.Running);
        }
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
        this.changeState(MinerStateValues.Stopped);
      } break;
      
      case MinerStateValues.Stopped: { 
        clearInterval(this.handle);
        observer.complete()
      }
    }         
  }
}
