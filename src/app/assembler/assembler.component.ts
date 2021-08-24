import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Assembler } from 'src/rjune/Assembler';
import { Recipe } from 'src/rjune/Recipe';
import { ResourceType } from '../../rjune/ResourceType';
import { ResourceTransferManager } from '../rjune-game/rjune-game.component';

@Component({
  selector: 'app-assembler',
  templateUrl: './assembler.component.html',
  styleUrls: ['./assembler.component.sass'],
})
export class AssemblerComponent implements OnInit, OnDestroy {
  @Input() recipe?: ResourceType;
  @Input() resourceTransferer?: ResourceTransferManager;
  assembler: Assembler = new Assembler();

  startAssembler(): void {
    if (this.resourceTransferer && this.recipe) {
      this.assembler.start(this.recipe, this.resourceTransferer);
    }
  }

  stopAssembler(): void {
    this.assembler.stop();
  }

  ngOnChanges(changes: SimpleChanges) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {}
}
