import { Component, EventEmitter, OnInit } from '@angular/core';
import { ResearchSlot } from 'src/app/research-center/research-center.component';
import { ResourceInventory } from 'src/factoryClicker/ResourceInventory';
import { ResourceTransferManager } from 'src/factoryClicker/ResourceTransferManager';
import { ResourceType } from 'src/factoryClicker/ResourceType';

interface SelectInfo { 

}

interface ResearchResourceInfo { 
  resourceType: ResourceType;
}

@Component({
  selector: 'ResourceSelect',
  templateUrl: './resource-selection-dialog.component.html',
  styleUrls: ['./resource-selection-dialog.component.sass'],
})
export class ResourceSelectionDialogComponent implements OnInit {
   
    slots: ResearchResourceInfo[] = [


    ]

    onSelect: EventEmitter<SelectInfo> = new EventEmitter<SelectInfo>()
    resourceService?: ResourceTransferManager;
    resourceTypes = ResourceType;

    constructor() { 
      
    }

    setupInventory (inventory: ResourceInventory) { 
      for (const resourceType in inventory.resourceInventoryContainer) { 
        const slot = inventory.resourceInventoryContainer[resourceType];
        this.slots.push({resourceType: slot.resourceType})
      }
    }

    registerOnSelectCallback(next: any, error?: any, complete?: any) { 
      this.onSelect.subscribe(next, error, complete);
    }

    onInventorySlotClicked(resourceType: ResourceType) { 
      this.onSelect.emit({resourceType}); 
    }

    onInputChanged() { 
        
    }

    ngOnInit(): void {
       
    }
}