import { Component, Input, OnInit } from "@angular/core";
import { ResourceTransferManager } from "src/factoryClicker/ResourceTransferManager";

@Component({
  selector: 'ResearchTab',
  templateUrl: './research-tab.component.html',
  styleUrls: ['./research-tab.component.sass'],
})
export class ResearchTabComponent implements OnInit {

    @Input() resourceTransferer?: ResourceTransferManager;
    debug: boolean = true;
    researchCenters: Array<any> = [1,2,3,4,5,6]

    ngOnInit(): void {

    }
}
