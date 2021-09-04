import { Component, Input, OnInit } from "@angular/core";
import { ResourceTransferManager } from "src/factoryClicker/ResourceTransferManager";
import { ResourceType } from "src/factoryClicker/ResourceType";

@Component({
  selector: 'SmeltingTab',
  templateUrl: './smelting-tab.component.html',
  styleUrls: ['./smelting-tab.component.sass'],
})
export class SmeltingTabComponent implements OnInit {

    @Input() resourceTransferer?: ResourceTransferManager;
    public smelters: Array<any> = [
        {
          selectedRecipe: {
            resourceType: ResourceType.Iron,
            displayName: 'Iron',
          },
        },
        {
          selectedRecipe: {
            resourceType: ResourceType.Copper,
            displayName: 'Copper',
          },
        },
        {
          selectedRecipe: {
            resourceType: ResourceType.Steel,
            displayName: 'Steel',
          },
        },
      ];

    ngOnInit(): void {

    }
}
