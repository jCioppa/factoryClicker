import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Recipe } from 'src/factoryClicker/Recipe';
import { ReceipeResult } from 'src/factoryClicker/RecipeResult';
import { ResourceTransferManager } from 'src/factoryClicker/ResourceTransferManager';
import { ResourceType } from 'src/factoryClicker/ResourceType';
import { Smelter } from 'src/factoryClicker/Smelter';
import { SmelterState, SmelterStateChange } from 'src/factoryClicker/SmelterState';
import { LoggerService } from '../logger/logger.service';
import { RecipeService } from '../services/RecipeService';

@Component({
  selector: 'Smelter',
  templateUrl: './smelter.component.html',
  styleUrls: ['./smelter.component.sass'],
})
export class SmelterComponent implements OnInit {
  @Input() resourceTransferer?: ResourceTransferManager;
  smelterDropdownOptions: Array<any> = [
    {
        displayName: 'Iron',
        value: ResourceType.Iron
    },
    {
      displayName: 'Copper',
      value: ResourceType.Copper
  },

  {
    displayName: 'Steel',
    value: ResourceType.Steel
  },

  {
    displayName: 'Stone Bricks',
    value: ResourceType.StoneBricks
  },

    
  ]
  selectedResourceType: ResourceType = ResourceType.None;
  loop: boolean = true;
  smelter: Smelter;
  displayDebug: boolean = true;
  state?: SmelterState;

  constructor(
    private recipeService: RecipeService,
    private logger: LoggerService
  ) {
    this.smelter = new Smelter(logger)
  }

  startSmelter() { 
    if (!this.smelter.running) {

      const miningContext = {
        progressPerTick: 0.1,
        updateRate: 20
      }

      const ups = 60;
      const updateRate = Math.floor(1000 / ups);
      this.state = new SmelterState(this.smelter, updateRate, miningContext , this.logger);
      
      if (this.state) { 
        const engine = this.state.start()
        if (engine) { 
          this.smelter.running = true;
          engine.subscribe((evt: SmelterStateChange) => { 

          })   
        }
      }  
    }
  }

  onRecipeSelectionChanged() {
    const selectedOption = this.selectedResourceType ?? ResourceType.None;
    const newRecipe = this.recipeService.findRecipe(selectedOption);
    if (newRecipe) { 
      this.smelter.setRecipe(newRecipe)
      this.initializeInventory(newRecipe)
      this.startSmelter();
    }
  }

  transferCoal() {
    if (this.resourceTransferer?.tryTransferResource(ResourceType.Coal, 1)) {
      this.smelter.addCoal(1)
      this.startSmelter();
    } 
  }

  transferRequiredResource(resourceType: ResourceType) { 
    const result: any = this.resourceTransferer?.getFromSource(resourceType, 1);
    this.smelter.addToStore(result.resourceType, result.count);
    this.startSmelter()  
  }

  initializeInventory(newRecipe: Recipe) { 
    for (const resource of newRecipe.requiredResources) { 
        this.smelter.resourceStore[resource.resourceType] = { count: 0, max: 10 }
    }
  }

  getAvailableResourceCount(resourceType: ResourceType) : number { 
    const result = this.smelter.resourceStore[resourceType].count ?? 0;
    return result;
  }

  transferOutput() {
    const {resourceType, count} = this.smelter.getAllOutput();
    if (this.resourceTransferer) {
      this.resourceTransferer.returnResource(resourceType, count);
    }
  }

  ngOnInit(): void {}
}
