import { EventEmitter } from "@angular/core";
import { ResourceType } from "./ResourceType";

export interface ResourceInventorySlot { 
    resourceType: ResourceType;
    count: number;
    max: number;
}


export interface AddInventoryResult { 
  added: number;
  returned: number;
}


export interface InventoryChangeEvent { 
  resourceType: ResourceType;
}

  export class ResourceInventory { 
  
    onInventoryChanged : EventEmitter<InventoryChangeEvent> = new EventEmitter<InventoryChangeEvent>()

    resourceInventoryContainer: {[resourceType: string]: ResourceInventorySlot} = {
      [ResourceType.CopperOre]: {
        resourceType: ResourceType.CopperOre,
        count: 0,
        max: 50
      },
  
      [ResourceType.IronOre]: {
        resourceType: ResourceType.IronOre,
  
        count: 0,
        max: 50
      },
  
      [ResourceType.Stone]: {
        resourceType: ResourceType.Stone,
  
        count: 0,
        max: 50
      },
  
      [ResourceType.Coal]: {
        resourceType: ResourceType.Coal,
  
        count: 0,
        max: 50
      },
  
      [ResourceType.Copper]: {
        resourceType: ResourceType.Copper,
  
        count: 0,
        max: 50
      },
      [ResourceType.Iron]: {
        resourceType: ResourceType.Iron,
        count: 0,
        max: 50
      },
      [ResourceType.Steel]: {
        resourceType: ResourceType.Steel,
  
        count: 0,
        max: 50
      },
      [ResourceType.StoneBricks]: {
        resourceType: ResourceType.StoneBricks,

        count: 0,
        max: 50
      },
      [ResourceType.IronGear]:{
        resourceType: ResourceType.IronGear,
  
        count: 0,
        max: 50
      },
      [ResourceType.CopperWire]: {
        resourceType: ResourceType.CopperWire,
  
        count: 0,
        max: 50
      },
  
      [ResourceType.RedScience]: {
        resourceType: ResourceType.RedScience,
  
        count: 0,
        max: 50
      },
    };
  
    fill() { 
      for (const key in this.resourceInventoryContainer) { 
        this.resourceInventoryContainer[key].count = this.resourceInventoryContainer[key].max;
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
      this.onInventoryChanged.observers.push({ next, error, complete })
    }

    add(resourceType: ResourceType, count: number): AddInventoryResult { 
      
      const currentAmount = this.resourceCount(resourceType);
      const limit = this.resourceLimit(resourceType);
      let amountToAdd = count;

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
  