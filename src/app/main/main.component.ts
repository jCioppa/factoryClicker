import { Component, OnInit } from '@angular/core';
import { Recipe } from 'src/factoryClicker/Recipe';
import { ResourceInventory } from 'src/factoryClicker/ResourceInventory';
import { ResourceTransferManager } from 'src/factoryClicker/ResourceTransferManager';
import { ResourceType } from 'src/factoryClicker/ResourceType';
import { CommandService } from '../services/CommandService';
import { RecipeService } from '../services/RecipeService';

// these are options in the recipe dropdown, and isn't used outside this class
interface RecipeOptionInfo {
  value: ResourceType;
  name: string;
}

interface AssemblerInfo { 

}

const availableAssemblerInfo = {
  numAssemblers: 3,
  assemblerInfos: []
}

interface SmelterInfo {}

const availableSmelterInfo = {
  numSmelters: 3,
  smelterInfos: []
}

interface MinerInfo { 

}

const availableMinersInfo = {
  numMiners: 3,
  minerInfos: []
}

interface ResearchLabInfo { 

}

const availableResearchLabInfo = {
  numLabs: 3,
  labInfos: []
}

@Component({
  selector: 'Main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass'],
})
export class MainComponent implements OnInit {

  public debug: boolean = true;
  public resource = ResourceType;

  public resourceInventory: ResourceInventory;
  public resourceTransferer: ResourceTransferManager

  constructor(private commandService: CommandService) {
    
    this.resourceInventory = new ResourceInventory();
    this.resourceTransferer = new ResourceTransferManager(this.resourceInventory);

    commandService.registerCommand('inventory', 'manages inventory', (option: string) => { 
      switch (option) { 
        case 'fill': { 
           this.resourceInventory.fill()
          break; 
        }        
        default: { 
          
        }
      }
   })
  }

  ngOnInit(): void {}
  
  onSelectionChanged() {}
 
}
