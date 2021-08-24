import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Assembler } from 'src/factoryClicker/Assembler';
import { ResourceTransferManager } from 'src/factoryClicker/ResourceTransferManager';
import { ResourceType } from '../../factoryClicker/ResourceType';

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

  ngOnDestroy(): void {}

  ngOnInit(): void {}
}
