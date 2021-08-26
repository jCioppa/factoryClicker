import { Component, Input, OnInit } from '@angular/core';
import { ResourceTransferManager } from 'src/factoryClicker/ResourceTransferManager';
import { ResourceType } from 'src/factoryClicker/ResourceType';
import { RecipeService } from '../services/RecipeService';

@Component({
  selector: 'Miner',
  templateUrl: './miner.component.html',
  styleUrls: ['./miner.component.sass'],
})
export class MinerComponent implements OnInit {
  @Input() currentSelection?: ResourceType;
  @Input() resourceTransferer?: ResourceTransferManager;

  progress: number = 0;
  duration: number = 10;
  coalCount: number = 0;
  outputCount: number = 0;
  outputLimit: number = 50;
  smeltingHandle: any = null;
  loop: boolean = true;

  transferCoal() {
    if (this.resourceTransferer?.tryTransferResource(ResourceType.Coal, 1)) {
      this.coalCount++;
      this.tryStartMining();
    }
  }

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

  constructor(private recipeService: RecipeService) {}

  onRecipeSelectionChanged(event: any) {
    const selectedOption = this.currentSelection ?? ResourceType.None;
    const currentRecipe = this.recipeService.findRecipe(selectedOption);
    this.tryStartMining();
  }

  minerProgress(): number {
    return 100 * (this.progress / this.duration);
  }

  ngOnInit(): void {}

  isRunning(): boolean {
    return this.smeltingHandle !== null;
  }

  tryStartMining() {
    if (!this.isRunning()) {
      const selectedOption = this.currentSelection ?? ResourceType.None;
      if (selectedOption !== ResourceType.None) {
        if (this.coalCount > 0) {
          if (this.outputCount < this.outputLimit) {
            this.coalCount--;
            this.smeltingHandle = setInterval(() => {
              this.tick();
            }, 10);
          }
        }
      }
    }
  }

  transferOutput() {
    if (this.outputCount > 0) {
      const selectedOption = this.currentSelection ?? ResourceType.None;
      if (selectedOption !== ResourceType.None && this.resourceTransferer) {
        this.resourceTransferer.returnResource(
          selectedOption,
          this.outputCount
        );
        this.outputCount = 0;
      }
    }
  }

  tick() {
    this.progress += 0.05;
    if (this.progress > this.duration) {
      this.outputCount++;
      clearInterval(this.smeltingHandle);
      this.smeltingHandle = null;
      this.progress = 0;

      if (this.loop) {
        this.tryStartMining();
      }
    }
  }
}
