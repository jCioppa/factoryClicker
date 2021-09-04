import { Component, Input, OnInit } from "@angular/core";
import { ResourceTransferManager } from "src/factoryClicker/ResourceTransferManager";

@Component({
  selector: 'AssemblerTab',
  templateUrl: './assembler-tab.component.html',
  styleUrls: ['./assembler-tab.component.sass'],
})
export class AssemblerTabComponent implements OnInit {

    debug: boolean = false;
    @Input() resourceTransferer?: ResourceTransferManager;
    availableAssemblers: Array<any> = [1, 2, 3];
    
    ngOnInit(): void {

    }
}
