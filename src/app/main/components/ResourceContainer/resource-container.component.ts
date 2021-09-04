import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InventoryChangeEvent, ResourceInventory } from 'src/factoryClicker/ResourceInventory';
import { ResourceType } from 'src/factoryClicker/ResourceType';

@Component({
  selector: 'ResourceContainer',
  templateUrl: './resource-container.component.html',
  styleUrls: ['./resource-container.component.sass'],
})
export class ResourceContainerComponent implements OnInit {

  @Input() public resourceType?: ResourceType;
  @Input() public displayName?: string;
  @Input() public inventory?: ResourceInventory;  
  @Input() public progress: number = 0;
  @Output() onClick = new EventEmitter<ResourceType>();

  imageSource: string = ''
  resourceCount: number = 0;
  resourceLimit: number = 0;
  canClickResource: boolean = true;

  updateInventorySetting() { 
    if (this.resourceType && this.inventory) { 
      this.resourceCount = this.inventory?.resourceCount(this.resourceType);
      this.resourceLimit = this.inventory?.resourceLimit(this.resourceType);
    }
  }

  setImageSourcePath() { 
    // NOTE(josel): this should dispatch over the resource type
    this.imageSource = 'assets/images/coal.png'; 
  }

  ngOnInit(): void {
    this.setImageSourcePath();
    this.updateInventorySetting();
    this.inventory?.register((event: InventoryChangeEvent) => { 
      if (event.resourceType == this.resourceType) { 
          this.updateInventorySetting()
      }
    })
  }

  ngOnDestroy(): void { 
   
  }

  onClickResource(): void {
    if (this.resourceType && this.inventory) { 
      this.onClick.emit(this.resourceType); 
    }
  }
}
