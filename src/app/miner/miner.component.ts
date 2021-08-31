import { Component, Input, OnInit } from '@angular/core';
import {  MinerState, MinerStateChange } from 'src/factoryClicker/MinerState';
import { ResourceTransferManager } from 'src/factoryClicker/ResourceTransferManager';
import { ResourceType } from 'src/factoryClicker/ResourceType';
import { LoggerService } from '../logger/logger.service';
import { RecipeService } from '../services/RecipeService';
import { Miner } from 'src/factoryClicker/Miner';

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
        progressPerTick: 0.1,
        updateRate: 20
      }

      const ups = 60;
      const updateRate = Math.floor(1000 / ups);
      this.state = new MinerState(this.miner, updateRate, miningContext , this.logger);
      
      if (this.state) { 
        const engine = this.state.start()
        if (engine) { 
          this.miner.running = true;
          engine.subscribe((evt: MinerStateChange) => { })   
        }
      }  
    }
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
    if (this.resourceTransferer?.tryTransferResource(ResourceType.Coal, 1)) {
      this.miner.addCoal(1)
      this.startMiner();
    } 
  }

  transferOutput() {
    const {resourceType, count} = this.miner.getAllOutput();
    if (this.resourceTransferer) {
      this.resourceTransferer.returnResource(resourceType, count);
    }
  }

  ngOnInit(): void {}
}