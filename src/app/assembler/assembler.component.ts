import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Assembler } from 'src/factoryClicker/Assembler';
import { Recipe } from 'src/factoryClicker/Recipe';
import { ResourceTransferManager } from 'src/factoryClicker/ResourceTransferManager';
import { ResourceType } from '../../factoryClicker/ResourceType';
import { LoggerService } from '../logger/logger.service';
import { CommandService } from '../services/CommandService';
import { RecipeService } from '../services/RecipeService';

interface RecipeOptionInfo {
  value: ResourceType;
  name: string;
}

@Component({
  selector: 'Assembler',
  templateUrl: './assembler.component.html',
  styleUrls: ['./assembler.component.sass'],
})
export class AssemblerComponent implements OnInit, OnDestroy {
  @Input() resourceType?: ResourceType;
  @Input() resourceTransferer?: ResourceTransferManager;

  assembler: Assembler = new Assembler();
  recipeSet: boolean = false;
  activeRecipe?: Recipe;
  selectedOption?: ResourceType;

  state: any = {
    duration: 0,
    progress: 0,
  };

  public availableRecipes: Array<RecipeOptionInfo> = [
    {
      value: ResourceType.None,
      name: 'None',
    },

    {
      value: ResourceType.IronGear,
      name: 'Iron Gears',
    },

    {
      value: ResourceType.CopperWire,
      name: 'Copper Wire',
    },

    {
      value: ResourceType.RedScience,
      name: 'Red Science',
    },
  ];

  constructor(
    private logger: LoggerService,
    private commandService: CommandService,
    private recipeService: RecipeService
  ) {
    commandService.registerCommand(
      'sendResources',
      'sends arg0 resources to the target',
      this.sendResources
    );
  }

  startAssembler(): void {
    if (this.resourceTransferer && this.resourceType) {
      this.activeRecipe = this.recipeService.findRecipe(this.resourceType);
      if (this.activeRecipe) {
        this.recipeSet = true;
        this.assembler.start(this.activeRecipe, this.resourceTransferer);
      } else {
        this.recipeSet = false;
      }
    }
  }

  sendResources(count: any) {
    if (this.resourceType && this.resourceTransferer) {
      const resourceCount: number = parseInt(count, 10);
      this.resourceTransferer.returnRecipeResult({
        resourceType: this.resourceType,
        count: resourceCount,
      });
    }
  }

  ngOnDestroy(): void {}

  ngOnInit(): void {}
}
