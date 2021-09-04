import { Component, Input, OnInit } from '@angular/core';
import { Miner } from 'src/factoryClicker/miner/Miner';
import {  MinerState, MinerStateChange } from 'src/factoryClicker/miner/MinerState';
import { ResourceTransferManager } from 'src/factoryClicker/ResourceTransferManager';
import { ResourceType } from 'src/factoryClicker/ResourceType';
import { LoggerService } from '../logger/logger.service';
import { RecipeService } from '../services/RecipeService';

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
  displayDebug: boolean = true;
  state?: MinerState;
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

  startMiner() { 
    if (!this.miner.running) {
      
      const miningContext = {
        progressPerTick: 0.1
      }

      const ups = 60;
      const updateRate = Math.floor(1000 / ups);
      this.state = new MinerState(this.miner, updateRate, miningContext , this.logger);
      
      if (this.state) { 
        const engine = this.state.start()
        if (engine) { 
          this.miner.running = true;
          engine.subscribe((evt: MinerStateChange) => this.onMiningComplete(evt))   
        }
      }  
    }
  }

  onMiningComplete(event: MinerStateChange) { 

  }

  onRecipeSelectionChanged() {
    const selectedOption = this.currentSelection ?? ResourceType.None;
    const newRecipe = this.recipeService.findMiningRecipe(selectedOption);
    if (newRecipe) { 
      this.miner.setRecipe(newRecipe)
      this.startMiner()
    }
  }

  transferCoal() {
    if (this.resourceTransferer) {
      const amountFetched = this.resourceTransferer.getResources(ResourceType.Coal, 1)
      if (amountFetched > 0) { 
        this.miner.addCoal(amountFetched)
        this.startMiner();
      }
    } 
  }

  transferOutput() {
    const {resourceType, count} = this.miner.getAllOutput();
    if (this.resourceTransferer) {
      this.resourceTransferer.pushResources(resourceType, count);
    }
  }

  ngOnInit(): void {}
}