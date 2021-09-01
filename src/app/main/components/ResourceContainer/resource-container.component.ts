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
  @Output() onClick = new EventEmitter<ResourceType>();

  imageSource: string = ''
  normalizedProgress: number = 0;
  resourceCount: number = 0;
  resourceLimit: number = 0;

  canClickResource: boolean = true;

  updateInventorySetting() { 
    if (this.resourceType && this.inventory) { 
      this.resourceCount = this.inventory?.resourceCount(this.resourceType);
      this.resourceLimit = this.inventory?.resourceLimit(this.resourceType);
      this.normalizedProgress = (this.resourceCount / this.resourceLimit) * 100;
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
      this.updateInventorySetting();
    }
  }
}
