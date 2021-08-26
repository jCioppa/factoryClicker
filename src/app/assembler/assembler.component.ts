import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Assembler } from 'src/factoryClicker/Assembler';
import { ResourceTransferManager } from 'src/factoryClicker/ResourceTransferManager';
import { ResourceType } from '../../factoryClicker/ResourceType';
import { LoggerService } from '../logger/logger.service';
import { CommandService } from '../services/CommandService';
import { RecipeService } from '../services/RecipeService';

@Component({
  selector: 'Assembler',
  templateUrl: './assembler.component.html',
  styleUrls: ['./assembler.component.sass'],
})
export class AssemblerComponent implements OnInit, OnDestroy {
  @Input() resourceType?: ResourceType;
  @Input() resourceTransferer?: ResourceTransferManager;
  assembler: Assembler = new Assembler();

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
      this.logger.log(
        'AssemblerComponent',
        'startAssembler',
        'starting assembler'
      );
      const recipe = this.recipeService.findRecipe(this.resourceType);
      this.assembler.start(recipe, this.resourceTransferer);
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
