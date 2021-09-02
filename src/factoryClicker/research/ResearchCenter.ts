import { ResearchSlot } from "src/app/research-center/research-center.component";
import { ResourceTransferManager } from "./ResourceTransferManager";
import { ResourceType } from "./ResourceType";

const researchLevel = (resourceType: ResourceType, currentLevel:number, experience: number, experienceToNextLevel: number) => ({resourceType,currentLevel, experience, experienceToNextLevel})

export class ResearchService { 

    researchLevels : any[] = [
        researchLevel(ResourceType.Coal, 1, 0, 1000),
        researchLevel(ResourceType.Copper, 1, 0, 1000),
        researchLevel(ResourceType.CopperOre, 1, 0, 1000),
        researchLevel(ResourceType.CopperWire, 1, 0, 1000),
        researchLevel(ResourceType.Iron, 1, 0, 1000),
        researchLevel(ResourceType.IronGear, 1, 0, 1000),
        researchLevel(ResourceType.Steel, 1, 0, 1000),
        researchLevel(ResourceType.Stone, 1, 0, 1000),
        researchLevel(ResourceType.StoneBricks, 1, 0, 1000),
        researchLevel(ResourceType.RedScience, 1, 0, 1000)
    ]
        
    processResourceExperience(resourceType: ResourceType, count: number): void {
        let block = this.researchLevels.find(b => b.resourceType === resourceType)
        if (block) { 
            block.experience += count;
            if (block.experience >= block.experienceToNextLevel) { 
                const remainder = block.experience % block.experienceToNextLevel;
                block.level++;
                block.experienceToNextLevel *= 2;
                block.experience = remainder;
            }
        }
    }
}

export class ResearchCenter {  

    resourceService: ResourceTransferManager;
    researchService: ResearchService;

    researchSlots: ResearchSlot[] = [
        {active: false, count: 0, max: 20, resourceType: ResourceType.None},
        {active: false, count: 0, max: 20, resourceType: ResourceType.None}
    ]

    progress: number = 0;
    maxProgress: number = 1000;
    normalizedResearchProgress: number = 0;

    constructor(resourceService: ResourceTransferManager, researchService: ResearchService) {
        this.resourceService = resourceService;
        this.researchService = researchService;
    }

    startResearch() { 

    }

    updateProgress(amount: number) {      
        this.progress = Math.min(this.maxProgress, this.progress + amount);
        this.normalizedResearchProgress = 100 * (this.progress / this.maxProgress);
        for (const slot of this.researchSlots) {
            if (slot.active && slot.count > 0) { 
                slot.count--;
                this.researchService?.processResourceExperience(slot.resourceType, 1);
            }
        }
    }

    initializeProgress() { 
        this.progress = 0;
        this.normalizedResearchProgress = 0;
    }

    ableToStartResearch() { 
        let canStart = false;
        for (const slot of this.researchSlots) { 
            if (slot.active && slot.count > 0) {
                canStart = true;
            }
        }
        return canStart;
    }

    onResearchComplete(): void { 

    }

    researchComplete() : boolean { 
        return this.progress >= this.maxProgress;
    }

    preStop(): void { 

    }

    stop(): void { 

    }
}