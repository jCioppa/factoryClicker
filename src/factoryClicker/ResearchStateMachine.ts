import { Observable } from "rxjs";
import { ResearchCenter } from "./ResearchCenter";
import { StateMachine } from "./StateMachine";

export interface ResearchCompleteEvent {

}

export enum ResearchStateValues { 
  Starting = "Starting",
  ResearchStarted = "ResearchStarted",
  Running = "Running", 
  RecipeComplete = "ResearchCompleted",
  Restarting = "Restarting",
  Stopping = "Stopping",
  Stopped = "Stopped",
  Idle = "Idle"
}


export class ResearchStateMachine extends StateMachine<ResearchCompleteEvent, ResearchStateValues> {

  lab?: ResearchCenter;
  context: any = null;

  constructor(lab: ResearchCenter, updateRate: number, context: any) { 
    super()
    this.lab = lab;
    this.updateRate = updateRate
    this.context = context;
  }

  start() : Observable<ResearchCompleteEvent>{ 
    return this.startInternal(ResearchStateValues.Starting)
  }

  stop() { 
    this.stopInternal(ResearchStateValues.Stopping)
  }

  run(observer: any) { 
    switch(this.currentState) {
      case ResearchStateValues.Idle: { 
      
      } break;

      case ResearchStateValues.Starting: {
        this.lab?.startResearch();
        this.changeState(ResearchStateValues.ResearchStarted)
      } break;

       // @NextState (Running)
      case ResearchStateValues.ResearchStarted: { 
        if (this.lab?.ableToStartResearch()){ 
          this.changeState(ResearchStateValues.Running)
        } else { 
          this.changeState(ResearchStateValues.Idle)
        }
      } break;

       // @NextState (Running | RecipeComplete)
      case ResearchStateValues.Running: {         
          this.lab?.updateProgress(this.context.progressPerTick)
          if (this.lab?.researchComplete()) { 
            this.changeState(ResearchStateValues.RecipeComplete)
          }
      } break;

      // @NextState (Restarting | Stopping | RecipeComplete)
      case ResearchStateValues.RecipeComplete: { 
        observer.next({});
        this.changeState(ResearchStateValues.Stopping)
      } break;

      // @NextState (RecipeStarted)
      case ResearchStateValues.Restarting: { 
      
      }  break;

      case ResearchStateValues.Stopping: { 
        if (this.engine) { 
          this.lab?.preStop()
          this.changeState(ResearchStateValues.Stopped)
        }
      } break;
      
      case ResearchStateValues.Stopped: { 
        this.lab?.stop();
        clearInterval(this.handle);
        observer.complete()
      }
    }         
  }
}