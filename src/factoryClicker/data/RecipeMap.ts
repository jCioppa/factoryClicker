import { ResourceType } from 'src/factoryClicker/ResourceType';

const resourceEntry = (resourceType: any, count: number) => ({
  resourceType,
  count,
});

const recipeEntry = (
  name: string,
  resourceType: ResourceType,
  duration: number,
  requiredResources: Array<any>,
  output: any
) => ({
  name,
  resourceType,
  duration,
  requiredResources,
  output,
});

export const MinerRecipes = [
  recipeEntry(
    'Coal',
    ResourceType.Coal,
    10,
    [resourceEntry(ResourceType.Coal, 1)],
    resourceEntry(ResourceType.Coal, 1)
  ),
  recipeEntry(
    'Iron Ore',
    ResourceType.IronOre,
    10,
    [resourceEntry(ResourceType.Coal, 1)],
    resourceEntry(ResourceType.IronOre, 1)
  ),
  recipeEntry(
    'Copper Ore',
    ResourceType.CopperOre,
    10,
    [resourceEntry(ResourceType.Coal, 1)],
    resourceEntry(ResourceType.CopperOre, 1)
  ),
  recipeEntry(
    'Stone',
    ResourceType.Stone,
    10,
    [resourceEntry(ResourceType.Coal, 1)],
    resourceEntry(ResourceType.Stone, 1)
  ),
];

export const SmelterRecipes = [
  recipeEntry(
    'Iron',
    ResourceType.Iron,
    10,
    [
      resourceEntry(ResourceType.IronOre, 1),
      resourceEntry(ResourceType.Coal, 1),
    ],
    resourceEntry(ResourceType.Iron, 1)
  ),
];

export const AssemblerRecipes = [
  recipeEntry(
    'Gear',
    ResourceType.IronGear,
    10,
    [resourceEntry(ResourceType.Iron, 2)],
    resourceEntry(ResourceType.Iron, 1)
  ),
];

export const RecipeMap: any = {
  [ResourceType.Iron]: {
    name: 'Iron',
    duration: 10,
    output: resourceEntry(ResourceType.Iron, 1),
    requiredResources: [
      resourceEntry(ResourceType.IronOre, 1),
      resourceEntry(ResourceType.Coal, 1),
    ],
  },

  [ResourceType.Copper]: {
    name: 'Copper',
    duration: 10,
    output: resourceEntry(ResourceType.Copper, 1),
    requiredResources: [
      resourceEntry(ResourceType.CopperOre, 1),
      resourceEntry(ResourceType.Coal, 1),
    ],
  },

  [ResourceType.StoneBricks]: {
    name: 'StoneBricks',
    duration: 10,
    output: resourceEntry(ResourceType.StoneBricks, 1),
    requiredResources: [
      resourceEntry(ResourceType.Stone, 1),
      resourceEntry(ResourceType.Coal, 1),
    ],
  },

  [ResourceType.Steel]: {
    name: 'Steel',
    duration: 50,
    output: resourceEntry(ResourceType.Steel, 1),
    requiredResources: [
      resourceEntry(ResourceType.Iron, 5),
      resourceEntry(ResourceType.Coal, 1),
    ],
  },

  [ResourceType.IronGear]: {
    name: 'Iron Gears',
    duration: 25,
    output: resourceEntry(ResourceType.IronGear, 2),
    requiredResources: [resourceEntry(ResourceType.Iron, 2)],
  },

  [ResourceType.CopperWire]: {
    name: 'Copper Wire',
    duration: 25,
    output: resourceEntry(ResourceType.CopperWire, 2),
    requiredResources: [resourceEntry(ResourceType.Copper, 2)],
  },

  [ResourceType.RedScience]: {
    name: 'Red Science',
    duration: 100,
    output: resourceEntry(ResourceType.RedScience, 1),
    requiredResources: [
      resourceEntry(ResourceType.Copper, 1),
      resourceEntry(ResourceType.IronGear, 1),
    ],
  },
};
