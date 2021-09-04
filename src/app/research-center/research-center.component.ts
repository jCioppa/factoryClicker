import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ResearchCenter } from 'src/factoryClicker/research/ResearchCenter';
import { ResearchCompleteEvent, ResearchStateMachine } from 'src/factoryClicker/research/ResearchStateMachine';
import { ResourceTransferManager } from 'src/factoryClicker/ResourceTransferManager';
import { ResourceType } from 'src/factoryClicker/ResourceType';
import { ResourceSelectionDialogComponent } from '../main/components/ResourceSelectionDialog/resource-selection-dialog.component';
import { ResearchService } from '../services/ResearchService';

export interface ResearchInput { 
  count: number;
  max: number;
  type: ResourceType;
}

export class ResearchSlot { 
  active: boolean;
  count: number;
  max: number;
  resourceType: ResourceType;

  constructor(count: number, max: number) { 
   this.active = false;
   this.count = count;
   this.max = max;
   this.resourceType = ResourceType.None;
  }

  activate(resourceType: ResourceType) { 
    this.active = true;
    this.resourceType = resourceType;
  }

  add(count: number): number {
    let amountToAdd = count;
    const newCount = this.count + count;
    if (newCount > this.max) { 
        amountToAdd = this.max - this.count;
    }
    this.count += amountToAdd;
    return amountToAdd;
  }
}

@Component({
  selector: 'ResourceCenter',
  templateUrl: './research-center.component.html',
  styleUrls: ['./research-center.component.sass']
})
export class ResearchCenterComponent implements OnInit {

  @Input() resourceTransferer?: ResourceTransferManager; 

  resourceTypes = ResourceType;
  lab?: ResearchCenter;
  labState?: ResearchStateMachine;
  
  constructor(
    private researchService: ResearchService, 
    private resourceSelectDialog: MatDialog) {
    
  }
  
  debug: boolean = true;

  researchContext: any = {
    progressPerTick: 0.1,
    updatesPerSecond: 10
  }

  tryStartResearching() { 
      const updateRate = 1000 / this.researchContext.updatesPerSecond;
      if (!this.labState && this.lab) { 
        this.labState = new ResearchStateMachine(this.lab, updateRate, this.researchContext)
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
  
      dialogRef.afterClosed().subscribe(result => {});
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