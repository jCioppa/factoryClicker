import { invalid } from '@angular/compiler/src/render3/view/util';
import { Component, Input, OnInit } from '@angular/core';
import { RecipeService } from 'src/app/services/RecipeService';
import { Recipe } from 'src/factoryClicker/Recipe';
import { ResourceInventory } from 'src/factoryClicker/ResourceInventory';
import { ResourceType } from 'src/factoryClicker/ResourceType';
import { StateMachine } from 'src/factoryClicker/smelter/StateMachine';

interface ResourceGainedEvent{
    resourceType: ResourceType;
    count: number;
 }

enum ResourceState {
    Stopped = "Stopped",
    Stopping = "Stopping",
    Starting = "Starting",
    Running = "Running",
    Idle = "Idle"
}

const invalidStateException = () => {
  return new Error('invalid state')
}

class ResourceStateMachine extends StateMachine<ResourceGainedEvent, ResourceState> { 

    resourceContainers: any[];
    context: any;

    constructor(updateRate: number, resourceContainers: any, context: any) { 
        super(updateRate)
        this.resourceContainers = resourceContainers;
        this.context = context;
    }

    start(): any { 
       return this.startInternal(ResourceState.Starting)
    }

    stop() { 
        this.stopInternal(ResourceState.Stopping)
    }

    run (observer: any) { 
        switch(this.currentState) { 
        
            case ResourceState.Idle: {
              for (const container of this.resourceContainers) { 
                  if (container.isRunning) { 
                      this.changeState(ResourceState.Running);
                      break;
                  }
                }
            } break;

            case ResourceState.Stopping: {
                this.changeState(ResourceState.Stopped)
            } break;
        
            case ResourceState.Stopped: {
                clearInterval(this.handle);
                observer.complete()
            } break;
        
            case ResourceState.Starting: {
                this.changeState(ResourceState.Running)
            } break;

            case ResourceState.Running: {
                let anyActive: boolean = false
                for (const container of this.resourceContainers) { 
                    if (container.isRunning) { 
                        anyActive = true;
                        container.progress += this.context.progressPerTick; 

                        if (container.progress > 100) {
                            observer.next({
                                resourceType: container.resourceType,
                                count: 1
                            })
                            container.progress = 0;
                            container.isRunning = false;
                        }
                    } 
                }
                if (!anyActive) { 
                    this.changeState(ResourceState.Idle)
                }
            } break;
            case ResourceState.Idle: {} break;
        }
    }
}


@Component({
  selector: 'ResourceContainerTab',
  templateUrl: './resource-container-tab.component.html',
  styleUrls: ['./resource-container-tab.component.sass'],
})
export class ResourceContainerTabComponent implements OnInit {
  
    debug: boolean = true;
    stateContext: any = {
      targetUps:  20,
      progressPerTick: 1
    }

    public resourceContainers: Array<any> = [
        {
          displayName: 'Iron Ore',
          resourceType: ResourceType.IronOre,
          isRunning: false,
          progress: 0
        },
    
        {
          displayName: 'Copper Ore',
          resourceType: ResourceType.CopperOre,
          isRunning: false,
          progress: 0
        },
        {
          displayName: 'Coal',
          resourceType: ResourceType.Coal,
          isRunning: false,
          progress: 0
        },
    
        {
          displayName: 'Stone',
          resourceType: ResourceType.Stone,
          isRunning: false,
          progress: 0
        },
    
        {
          displayName: 'Iron',
          resourceType: ResourceType.Iron,
          isRunning: false,
          progress: 0
        },
    
        {
          displayName: 'Steel',
          resourceType: ResourceType.Steel,
          isRunning: false,
          progress: 0
        },
    
        {
          displayName: 'Copper',
          resourceType: ResourceType.Copper,
          isRunning: false,
          progress: 0
        },
    
        {
          displayName: 'Copper Wire',
          resourceType: ResourceType.CopperWire,
          isRunning: false,
          progress: 0
        },
    
        {
          displayName: 'Iron Gear',
          resourceType: ResourceType.IronGear,
          isRunning: false,
          progress: 0
        },
      ];
      
    @Input() public resourceInventory?: ResourceInventory;
    
    state: ResourceStateMachine;

    constructor(private recipeService: RecipeService){
        const ups = this.stateContext.targetUps;
        const updateRate = Math.floor(1000 / ups);
        this.state = new ResourceStateMachine(updateRate, this.resourceContainers, this.stateContext)
    }

    onResourceGained (evt: ResourceGainedEvent) { 
      if ( !this.resourceInventory) { 
        throw  invalidStateException()
      }
      this.resourceInventory.add(evt.resourceType, evt.count)
    }

    onResourceStateError(error: any) {

    }

    onResourceStateShutdown() { 
      this.state.active = false;
    }

    onClickResource(resourceType: ResourceType) {

        if (!this.resourceContainers || !this.resourceInventory) { 
            throw  invalidStateException()
        }

        if (!this.state.active) { 
          const engine: any = this.state.start()
          if (engine) { 
            
            engine.subscribe(
              (evt: ResourceGainedEvent) => this.onResourceGained(evt), 
              (err: any) => this.onResourceStateError(err), 
              () => this.onResourceStateShutdown()) 

            this.state.active = true;
          }
        } 

        const clickedContainer: any = this.resourceContainers.find(container => container.resourceType === resourceType);

        if (clickedContainer && !clickedContainer.isRunning) { 
            const recipe: Recipe = this.recipeService.findRecipe(resourceType);
            if (recipe) {
                if (this.ableToBuildRecipe(recipe)) {
                    this.consumeResources(recipe);
                    clickedContainer.isRunning = true;
                } 
            } 
        }
    }

    ableToBuildRecipe(recipe: Recipe): boolean {
        if (!this.resourceInventory) { 
            throw invalidStateException();
        }

        for (const requiredResource of recipe.requiredResources) {
            if (!this.resourceInventory.ableToRemove(requiredResource.resourceType, requiredResource.count)) {
                return false;
            }
        }
        return true;
      }

      consumeResources(recipe: Recipe) {
        if (!this.resourceInventory) { 
          throw invalidStateException();
        }

        if (this.resourceInventory.ableToAdd(recipe.output.resourceType, recipe.output.count)) {
          for (const requiredResource of recipe.requiredResources) {
            const requiredAmount = requiredResource.count;
            const requiredResourceType = requiredResource.resourceType;
            this.resourceInventory.remove(requiredResourceType, requiredAmount)
          }
        }
      }

    ngOnInit(): void {
    
    }  
}
