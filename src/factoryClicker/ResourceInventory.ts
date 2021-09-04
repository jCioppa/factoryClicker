import { EventEmitter } from "@angular/core";
import { resourceSlot, ResourceSlot } from "./ResourceSlot";
import { ResourceType } from "./ResourceType";



export interface AddInventoryResult { 
  added: number;
  returned: number;
}


export interface InventoryChangeEvent { 
  resourceType: ResourceType;
}

export class ResourceInventory { 
  
  onInventoryChanged : EventEmitter<InventoryChangeEvent> = new EventEmitter<InventoryChangeEvent>()

  resourceInventoryContainer: {[resourceType: string]: ResourceSlot} = {
    [ResourceType.CopperOre]:   resourceSlot(ResourceType.CopperOre, 0, 50),
    [ResourceType.IronOre]:     resourceSlot(ResourceType.IronOre, 0, 50),
    [ResourceType.Stone]:       resourceSlot(ResourceType.Stone, 0, 50),
    [ResourceType.Coal]:        resourceSlot(ResourceType.Coal, 0, 50),
    [ResourceType.Copper]:      resourceSlot(ResourceType.Copper, 0, 50),
    [ResourceType.Iron]:        resourceSlot(ResourceType.Iron, 0, 50),
    [ResourceType.Steel]:       resourceSlot(ResourceType.Steel, 0, 50),
    [ResourceType.StoneBricks]: resourceSlot(ResourceType.StoneBricks, 0, 50),
    [ResourceType.IronGear]:    resourceSlot(ResourceType.IronGear, 0, 50),
    [ResourceType.CopperWire]:  resourceSlot(ResourceType.CopperWire, 0, 50),
    [ResourceType.RedScience]:  resourceSlot(ResourceType.RedScience, 0, 50)
  };
  
  resourceTypes : ResourceType[] = [
    ResourceType.CopperOre,
    ResourceType.Coal,
    ResourceType.Copper,
    ResourceType.CopperWire,
    ResourceType.Iron,
    ResourceType.IronGear,
    ResourceType.IronOre,
    ResourceType.RedScience,
    ResourceType.Steel,
    ResourceType.Stone,
    ResourceType.StoneBricks,
  ]

  fill() { 
    this.foreachResource((resourceType: ResourceType) => { 
      this.fillResource(resourceType)
    })
  }

  clear() { 
    this.foreachResource((resourceType: ResourceType) => { 
      this.clearResource(resourceType)
    })
  }

  fillResource(resourceType: ResourceType) { 
    this.add(resourceType, 50)
  }

  foreachResource(callback: (type: ResourceType) => void) { 
    for (const resourceType of this.resourceTypes) { 
      callback(resourceType)
    }
  }

  ableToAdd(resourceType: ResourceType, count: number) : boolean {
    const amount = this.resourceCount(resourceType);
    const limit = this.resourceLimit(resourceType); 
    if (amount + count <= limit) { 
      return true
    }
    return false;
  }
  
  register(next: (event: InventoryChangeEvent) => void, complete?: any, error?: any) { 
    this.onInventoryChanged.subscribe(next, error, complete) 
  }

  add(resourceType: ResourceType, count: number): AddInventoryResult {       
    let amountToAdd = count;

    const currentAmount = this.resourceCount(resourceType);
    const limit = this.resourceLimit(resourceType);

    if (currentAmount + amountToAdd > limit) { 
      amountToAdd = limit - currentAmount;
    }

    this.resourceInventoryContainer[resourceType].count += amountToAdd;

    if (amountToAdd > 0) { 
      this.onInventoryChanged.emit({resourceType})
    }

    return {
      added: amountToAdd,
      returned: count - amountToAdd
    }
  }

  ableToRemove(resourceType: ResourceType, amountToRemove: number): boolean { 
    const ownedResourceAmount = this.resourceInventoryContainer[resourceType].count;
    if (ownedResourceAmount >= amountToRemove) {
      return true;
    }
    return false;
  }
  
  clearResource(resourceType: ResourceType) { 
      const amount = this.resourceCount(resourceType);
      if (amount > 0) { 
        this.remove(resourceType, amount)
      }
  }

  remove(resourceType: ResourceType, count: number): number {       
    const currentAmount = this.resourceCount(resourceType);  
    let amountToRemove = count;
    
    if (amountToRemove > currentAmount) { 
      amountToRemove = currentAmount;
    }

    this.resourceInventoryContainer[resourceType].count -= amountToRemove;

    if (amountToRemove > 0) { 
        this.onInventoryChanged.emit({resourceType})
    }

    return amountToRemove;
  }
  
  resourceCount(type: ResourceType): number { 
    return this.resourceInventoryContainer[type] ? 
      this.resourceInventoryContainer[type].count : 0;
  }

  resourceLimit(type:ResourceType): number { 
    return this.resourceInventoryContainer[type] ? 
    this.resourceInventoryContainer[type].max : 0;
  }
}