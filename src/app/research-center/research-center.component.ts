import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ResearchCenter, ResearchService } from 'src/factoryClicker/ResearchCenter';
import { ResearchCompleteEvent, ResearchStateMachine } from 'src/factoryClicker/ResearchStateMachine';
import { ResourceTransferManager } from 'src/factoryClicker/ResourceTransferManager';
import { ResourceType } from 'src/factoryClicker/ResourceType';
import { ResourceSelectionDialogComponent } from '../main/components/ResourceSelectionDialog/resource-selection-dialog.component';

export interface ResearchInput { 
  count: number;
  max: number;
  type: ResourceType;
}

export interface ResearchSlot { 
  active: boolean;
  count: number;
  max: number;
  resourceType: ResourceType;
}

@Component({
  selector: 'ResourceCenter',
  templateUrl: './research-center.component.html',
  styleUrls: ['./research-center.component.sass']
})
export class ResearchCenterComponent implements OnInit {

  @Input() resourceTransferer?: ResourceTransferManager; 
  @Input() researchService?: ResearchService;

  selectionDialogOpen: boolean = false;
  resourceTypes = ResourceType;
  lab?: ResearchCenter;
  labState?: ResearchStateMachine;

  constructor(public resourceSelectDialog: MatDialog) {
    
  }

  tryStartResearching() { 
      const researchContext = { progressPerTick: 5.0}
      const ups = 10;
      const updateRate = 1000 / ups;
      if (!this.labState && this.lab) { 
        this.labState = new ResearchStateMachine(this.lab, updateRate, researchContext)
        const engine = this.labState.start();
        
        if (engine) {
          engine.subscribe((event: ResearchCompleteEvent) => this.onResearchComplete(event))
        } else { 

        }
      }
  }

  onResearchComplete(event: ResearchCompleteEvent){ 
    
  }

  openResourceSelectionDialog(slot: ResearchSlot) { 
    if (this.resourceTransferer && this.resourceTransferer.resourceContainer) { 

      const dialogRef = this.resourceSelectDialog.open(ResourceSelectionDialogComponent); 
      dialogRef.componentInstance.resourceService = this.resourceTransferer;
      dialogRef.componentInstance.setupInventory(this.resourceTransferer.resourceContainer);
    
      dialogRef.afterOpened().subscribe(() => { 
         this.selectionDialogOpen = true;
          dialogRef.componentInstance.registerOnSelectCallback((data: any) => {
             if (data && data.resourceType) { 
                if (slot) { 
                  slot.resourceType = data.resourceType;
                  slot.active = true;
                  this.tryStartResearching();
                }
             }
             dialogRef.close(data) 
          })
      }) 
  
      dialogRef.afterClosed().subscribe(result => {
        this.selectionDialogOpen = false;
      });
    }
  }

  onClickResearchSlot(slot: ResearchSlot) { 
    if (!slot.active) { 
      this.openResourceSelectionDialog(slot)
    } else { 
      if (this.resourceTransferer) { 
        const fetched: number = this.resourceTransferer.getResources(slot.resourceType, 1)
        if (fetched > 0) { 
          slot.count += fetched;
        }
      }
    }
  }

  ngOnInit(): void {
    if (!this.resourceTransferer || !this.researchService) { 
      throw new Error('invalid params')
    } 
    this.lab = new ResearchCenter(this.resourceTransferer, this.researchService)
  }
}