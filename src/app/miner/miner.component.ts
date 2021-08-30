import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MinerState, MinerStateChange } from 'src/factoryClicker/MinerState';
import { Recipe } from 'src/factoryClicker/Recipe';
import { ResourceTransferManager } from 'src/factoryClicker/ResourceTransferManager';
import { ResourceType } from 'src/factoryClicker/ResourceType';
import { LoggerService } from '../logger/logger.service';
import { RecipeService } from '../services/RecipeService';



const assert = (object: any, message: string) => { 
  if (!object) { 
    throw new Error(message);
  }
}

export class Miner {

  normalizedPower: number = 0;
  normalizedProgress: number = 0;
  recipe?: Recipe;
  progress: number = 0;
  running: boolean = false;
  blocked: boolean = false;
  coalBuffer: any = { count: 0, max: 10 }

  maxPower: number = 10;
  power: number = 0;   
  powerPerCoal: number = 10;

  outputBuffer: any = {
    count: 0,
    max: 50
  }

  loop: boolean= true;
  state?: MinerState;

  logger: LoggerService;

  constructor(logger: LoggerService) { 
    this.logger = logger;
  }

  updateProgress() { 
    if (this.recipe){
      this.progress += 0.1;
      this.normalizedProgress = (this.progress / this.recipe?.duration) * 100;
    }
  }

  restart() {

  }

  ableToBuildRecipe(recipe: Recipe) : boolean { 
    return false;
  }

  completeRecipe() { 
    if (this.recipe) { 
      this.outputBuffer.count = Math.min( this.outputBuffer.count + this.recipe.output.count, this.outputBuffer.max)
      this.progress = 0;
      this.normalizedProgress = 0;
    }
  }

  updatePower() { 
    if (this.recipe){
      this.power = Math.max(this.power - 0.05, 0)
      this.normalizedPower = (this.power / this.maxPower) * 100;
    }
  }

  hasCompletedRecipe() { 
    return this.recipe && (this.progress > this.recipe?.duration);          
  }

  getAllOutput(): any {
    const result = {
      resourceType: this.recipe?.output.resourceType,
      count: this.outputBuffer.count
    }
    this.outputBuffer.count = 0;
    return result;
  }

  start() {
    if (!this.running || !this.state) {
      this.running = true;
      this.state = new MinerState(this, 10, {
          progressPerTick: 0.1,
          updateRate: 20
        }, this.logger);
      }
    return this.state.start()
  } 

  setRecipe(recipe: Recipe) { 
    this.recipe = recipe;
  }

  stop() {
    this.running = false;
  }

  addCoal(amount: number) {
      this.coalBuffer.count = Math.min(this.coalBuffer.count + amount, this.coalBuffer.max)
  }

  consumeFuel(): void {
    if (this.power <= 0 && this.coalBuffer.count > 0) { 
        this.coalBuffer.count -= 1;
        this.power += this.powerPerCoal;
    }
    this.normalizedPower = 100 * (this.power / this.maxPower);
  }
}

@Component({
  selector: 'Miner',
  templateUrl: './miner.component.html',
  styleUrls: ['./miner.component.sass'],
})
export class MinerComponent implements OnInit {
  
  @Input() resourceTransferer?: ResourceTransferManager;
  currentSelection: ResourceType = ResourceType.None;
  loop: boolean = true;
  miner: Miner;
  displayDebug: boolean = false;

  dropdownOptions: Array<any> = [
    {
      displayName: 'Iron Ore',
      value: ResourceType.IronOre,
    },
    {
      displayName: 'Copper Ore',
      value: ResourceType.CopperOre,
    },
    {
      displayName: 'Coal',
      value: ResourceType.Coal,
    },
    {
      displayName: 'Stone',
      value: ResourceType.Stone,
    },
  ];

  constructor(
    private recipeService: RecipeService,
    private logger: LoggerService
  ) {
    this.miner = new Miner(logger)
  }

  onRecipeSelectionChanged(event: any) {
    // parse recipe from dropdown
    const selectedOption = this.currentSelection ?? ResourceType.None;
    const newRecipe = this.recipeService.findMiningRecipe(selectedOption);
    if (newRecipe) { 
      this.miner.setRecipe(newRecipe);
      const observable: any = this.miner.start();
      if (observable) { 
        observable.subscribe((event: MinerStateChange) => { 
        })
      }
    }
  }

  transferCoal() {
    if (this.resourceTransferer?.tryTransferResource(ResourceType.Coal, 1)) {
      this.miner.addCoal(1)
      this.miner.start();
    } 
  }

  transferOutput() {
    // remove all produced resources from miner
    const {resourceType, count} = this.miner.getAllOutput();
    if (this.resourceTransferer) {
      this.resourceTransferer.returnResource(resourceType, count);
    }
  }
  
  ngOnInit(): void {}
}
