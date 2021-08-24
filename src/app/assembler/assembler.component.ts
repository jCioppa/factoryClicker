import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Assembler } from 'src/rjune/Assembler';
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
    if (this.recipe && this.resourceTransferer) {
      this.assembler.start(this.recipe, this.resourceTransferer);
    }
  }

  ngOnChanges(changes: SimpleChanges) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {}
}
