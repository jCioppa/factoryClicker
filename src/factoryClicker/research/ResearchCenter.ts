import { ResearchSlot } from "src/app/research-center/research-center.component";
import { ResearchService } from "src/app/services/ResearchService";
import { ResourceTransferManager } from "../ResourceTransferManager";

export class ResearchCenter {  

    resourceService: ResourceTransferManager;
    researchService: ResearchService;

    researchSlots: ResearchSlot[] = [
        new ResearchSlot(0, 20),
        new ResearchSlot(0, 20)
    ]

    progress: number = 0;
    maxProgress: number = 50;
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