import { Observable } from "rxjs";

export class StateMachine<EventType, StateType> { 

    engine?: Observable<EventType>;
    handle?: any;
    updateRate: number = 0;
    currentState?: StateType;
    active: boolean = false;

    constructor(updateRate: number) { 
      this.updateRate = updateRate;
    }

    changeState(newState: StateType) { 
      this.currentState = newState;
    }
  
    startInternal(defaultState : StateType): Observable<EventType> { 
      this.changeState(defaultState);
      if (!this.engine) { 
        this.engine = new Observable<EventType>((observer: any) => { 
          this.handle = setInterval(() => this.run(observer), this.updateRate)
        })
      }
      return this.engine;
    }
    
    stopInternal(stoppingState: StateType): void { 
      if (this.engine) { 
        this.changeState(stoppingState);
      }
    }
  
    run(observer: any) { 
      throw new Error('must implement run')
    }
  }
  