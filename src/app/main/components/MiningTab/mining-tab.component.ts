import { Component, Input, OnInit } from "@angular/core";
import { ResourceTransferManager } from "src/factoryClicker/ResourceTransferManager";

@Component({
  selector: 'MiningTab',
  templateUrl: './mining-tab.component.html',
  styleUrls: ['./mining-tab.component.sass'],
})
export class MiningTabComponent implements OnInit {

    @Input() resourceTransferer?: ResourceTransferManager;
    miners: any[] = [1,2,3]

    ngOnInit(): void {

    }
}
