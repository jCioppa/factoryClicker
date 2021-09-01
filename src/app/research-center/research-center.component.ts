import { Component, Input, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ResearchCenter } from 'src/factoryClicker/ResearchCenter';
import { ResearchCompleteEvent, ResearchStateMachine } from 'src/factoryClicker/ResearchStateMachine';
import { ResourceTransferManager } from 'src/factoryClicker/ResourceTransferManager';
import { ResourceType } from 'src/factoryClicker/ResourceType';
import { ResourceSelectionDialogComponent } from '../main/components/ResourceSelectionDialog/resource-selection-dialog.component';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';

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

  selectionDialogOpen: boolean = false;
  resourceTypes = ResourceType;
  lab: ResearchCenter = new ResearchCenter();
  labState?: ResearchStateMachine;

  constructor(public resourceSelectDialog: MatDialog) { 

  }

  tryStartResearching() { 
      const researchContext = { progressPerTick: 5.0}
      const ups = 10;
      const updateRate = 1000 / ups;
      if (!this.labState) { 
        this.labState = new ResearchStateMachine(this.lab, updateRate, researchContext)
        const engine = this.labState.start();
        
        if (engine) {
          engine.subscribe((event: ResearchCompleteEvent) => { 

          })
        } else { 
        
        }
      }
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
        const result = this.resourceTransferer?.getFromSource(slot.resourceType, 1)
        if (result) { 
          slot.count += result.count;
        }
    }
  }

  ngOnInit(): void {

  }
}