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
import { LoggerService } from '../logger/logger.service';

@Component({
  selector: 'Assembler',
  templateUrl: './assembler.component.html',
  styleUrls: ['./assembler.component.sass'],
})
export class AssemblerComponent implements OnInit, OnDestroy {
  @Input() resourceType?: ResourceType;
  @Input() resourceTransferer?: ResourceTransferManager;
  assembler: Assembler = new Assembler();

  constructor(private logger: LoggerService) {}

  startAssembler(): void {
    if (this.resourceTransferer && this.resourceType) {
      this.logger.log(
        'AssemblerComponent',
        'startAssembler',
        'starting assembler'
      );
      this.assembler.start(this.resourceType, this.resourceTransferer);
    }
  }

  ngOnDestroy(): void {}

  ngOnInit(): void {}
}
