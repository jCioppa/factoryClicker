import { ResearchSlot } from "src/app/research-center/research-center.component";
import { ResourceType } from "./ResourceType";

export class ResearchCenter {  
    researchSlots: ResearchSlot[] = [
        {active: false, count: 0, max: 20, resourceType: ResourceType.None},
        {active: false, count: 0, max: 20, resourceType: ResourceType.None}
    ]
    progress: number = 0;
    maxProgress: number = 1000;
    normalizedResearchProgress: number = 0;

    startResearch() { 

    }

    updateProgress(amount: number) { 
        this.progress = Math.min(this.maxProgress, this.progress + amount);
        this.normalizedResearchProgress = 100 * (this.progress / this.maxProgress);
    }

    ableToStartResearch() { 
        return true;
    }

    researchComplete() : boolean { 
        return this.progress >= this.maxProgress;
    }

    preStop(): void { 

    }

    stop(): void { 

    }
}