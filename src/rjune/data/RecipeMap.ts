import { ResourceType } from 'src/rjune/ResourceType';

export const RecipeMap: any = {
  [ResourceType.IronGear]: {
    name: 'Iron Gears',
    duration: 25,
    output: {
      resourceType: ResourceType.IronGear,
      count: 2,
    },
    requiredResources: [
      {
        resourceType: ResourceType.Iron,
        count: 2,
      },
    ],
  },

  [ResourceType.CopperWire]: {
    name: 'Copper Wire',
    duration: 25,
    output: {
      resourceType: ResourceType.CopperWire,
      count: 2,
    },
    requiredResources: [
      {
        resourceType: ResourceType.Copper,
        count: 2,
      },
    ],
  },
};
