import { Component, Input, OnInit } from '@angular/core';
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
  @Input() currentSelection?: ResourceType;
  @Input() resourceTransferer?: ResourceTransferManager;

  progress: number = 0;
  coalCount: number = 0;
  outputCount: number = 0;
  outputLimit: number = 50;
  smeltingHandle: any = null;
  loop: boolean = true;
  miningSpeed: number = 0.05;
  activeRecipe: any = null;

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
  ) {}

  onRecipeSelectionChanged(event: any) {
    const selectedOption = this.currentSelection ?? ResourceType.None;
    this.activeRecipe = this.recipeService.findMiningRecipe(selectedOption);
    if (this.activeRecipe) {
      this.tryStartMining(this.activeRecipe);
    } else {
      this.logger.warning(
        'Miner',
        'onRecipeSelectionChanged',
        'no active recipe set'
      );
    }
  }

  minerProgress(): number {
    if (this.activeRecipe) {
      return 100 * (this.progress / this.activeRecipe.duration);
    } else {
      this.logger.warning('Miner', 'minerProgress', 'no active recipe set');
    }
    return 0;
  }

  transferCoal() {
    if (this.resourceTransferer?.tryTransferResource(ResourceType.Coal, 1)) {
      this.coalCount++;
      if (this.activeRecipe) {
        this.tryStartMining(this.activeRecipe);
      } else {
        this.logger.warning('Miner', 'transferCoal', 'no active recipe');
      }
    } else {
      this.logger.warning('Miner', 'transferCoal', 'failed coal transer');
    }
  }

  isRunning(): boolean {
    return this.smeltingHandle !== null;
  }

  tryStartMining(recipe: any) {
    if (!this.isRunning()) {
      if (this.coalCount > 0) {
        if (this.outputCount < this.outputLimit) {
          this.coalCount--;
          this.smeltingHandle = setInterval(() => {
            this.tick(recipe);
          }, 10);
        } else {
          this.logger.warning(
            'Miner',
            'tryStartMining',
            'output limit reached'
          );
        }
      } else {
        this.logger.warning('Miner', 'tryStartMining', 'not enough coal');
      }
    } else {
      this.logger.warning('Miner', 'tryStartMining', 'already mining');
    }
  }

  // returns the built resources back to the resource owner, via the resource transferer
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
    } else {
      this.logger.warning(
        'Miner',
        'transferOutput',
        'no resources to transfer'
      );
    }
  }

  tick(recipe: any) {
    this.progress += this.miningSpeed;
    if (this.progress > recipe.duration) {
      this.outputCount += recipe.output.count;
      clearInterval(this.smeltingHandle);
      this.smeltingHandle = null;
      this.progress = 0;

      if (this.loop) {
        this.tryStartMining(recipe);
      }
    }
  }

  ngOnInit(): void {}
}
