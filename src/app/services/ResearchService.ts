import { Injectable } from "@angular/core";
import { ResourceType } from "src/factoryClicker/ResourceType";

const researchLevel = (resourceType: ResourceType, currentLevel:number, experience: number, experienceToNextLevel: number) => ({resourceType, currentLevel, experience, experienceToNextLevel})

@Injectable()
export class ResearchService { 

    levelProgressMap: number[] = [100, 200, 300, 500, 800, 1300, 2100]
    
    researchLevels : any[] = [
        researchLevel(ResourceType.Coal, 1, 0, 100),
        researchLevel(ResourceType.Copper, 1, 0, 100),
        researchLevel(ResourceType.CopperOre, 1, 0, 100),
        researchLevel(ResourceType.CopperWire, 1, 0, 100),
        researchLevel(ResourceType.Iron, 1, 0, 100),
        researchLevel(ResourceType.IronGear, 1, 0, 100),
        researchLevel(ResourceType.Steel, 1, 0, 100),
        researchLevel(ResourceType.Stone, 1, 0, 100),
        researchLevel(ResourceType.StoneBricks, 1, 0, 100),
        researchLevel(ResourceType.RedScience, 1, 0, 100)
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