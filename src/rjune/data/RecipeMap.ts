import { ResourceType } from 'src/rjune/ResourceType';

export const RecipeMap: any = {
  [ResourceType.Iron]: {
    name: 'Iron',
    duration: 10,
    output: {
      resourceType: ResourceType.Iron,
      count: 1,
    },
    requiredResources: [
      {
        resourceType: ResourceType.IronOre,
        count: 1,
      },
      {
        resourceType: ResourceType.Coal,
        count: 1,
      },
    ],
  },

  [ResourceType.Copper]: {
    name: 'Copper',
    duration: 10,
    output: {
      resourceType: ResourceType.Copper,
      count: 1,
    },
    requiredResources: [
      {
        resourceType: ResourceType.CopperOre,
        count: 1,
      },
      {
        resourceType: ResourceType.Coal,
        count: 1,
      },
    ],
  },

  [ResourceType.StoneBricks]: {
    name: 'StoneBricks',
    duration: 10,
    output: {
      resourceType: ResourceType.StoneBricks,
      count: 1,
    },
    requiredResources: [
      {
        resourceType: ResourceType.Stone,
        count: 1,
      },
      {
        resourceType: ResourceType.Coal,
        count: 1,
      },
    ],
  },

  [ResourceType.Steel]: {
    name: 'Steel',
    duration: 50,
    output: {
      resourceType: ResourceType.Steel,
      count: 1,
    },
    requiredResources: [
      {
        resourceType: ResourceType.Iron,
        count: 5,
      },
      {
        resourceType: ResourceType.Coal,
        count: 1,
      },
    ],
  },

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

  [ResourceType.RedScience]: {
    name: 'Red Science',
    duration: 100,
    output: {
      resourceType: ResourceType.RedScience,
      count: 1,
    },
    requiredResources: [
      {
        resourceType: ResourceType.Copper,
        count: 1,
      },
      {
        resourceType: ResourceType.IronGear,
        count: 1,
      },
    ],
  },
};
