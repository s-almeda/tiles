//tiles.ts
//Tile types and util functions

/*
OVERVIEW:
- A TileMap is a LAYER of tiles as a 2D array (e.g., background, props, characters)  
- A World contains several layers of TileMaps that overlay each other
- Each Tile has a glyph, states, and visual properties
*/

// Basic dimension interface for consistent sizing
export interface Dimensions {
  width: number;
  height: number;
}

// Core Tile type - individual tile with visual and state data
export interface Tile {
  name: string;
  image?: string; // Optional, defaults to none
  glyph: string; // Visual representation like ",,," for grass
  states: string[]; // Available states, defaults to ["default"]
  currentState: string; // Current state, defaults to "default"
}

// Layer type options - there are 3 kinds of layers in a world
export type LayerType = "set" | "props" | "characters";

// TileMap - A LAYER of tiles as a 2D array (this is what gets rendered as one layer)
export interface TileMap {
  dimensions: Dimensions;
  rows: Tile[][]; // Array of rows, each row is an array of tiles
  type: LayerType;
}

// World - Contains several layers of TileMaps that overlay each other
export interface World {
  dimensions: Dimensions;
  setMap: TileMap;      // Background layer (terrain, etc.)
  propsMap: TileMap;    // Props layer (objects, switches, etc.)
  charactersMap: TileMap; // Characters layer (players, NPCs, etc.)
}

// Utility functions for creating tiles and maps
export const createTile = (
  name: string,
  glyph: string,
  options?: {
    image?: string;
    states?: string[];
    currentState?: string;
  }
): Tile => {
  const states = options?.states || ["default"];
  const currentState = options?.currentState || "default";
  
  // Validate that currentState exists in states array
  if (!states.includes(currentState)) {
    throw new Error(`Current state "${currentState}" must be included in states array`);
  }

  return {
    name,
    glyph,
    image: options?.image,
    states,
    currentState,
  };
};

export const createEmptyTileMap = (
  dimensions: Dimensions,
  type: LayerType,
  defaultTile?: Tile
): TileMap => {
  const emptyTile = defaultTile || createTile("empty", " ");
  
  const rows: Tile[][] = [];
  for (let y = 0; y < dimensions.height; y++) {
    const row: Tile[] = [];
    for (let x = 0; x < dimensions.width; x++) {
      // Create a copy of the tile for each position
      row.push({ ...emptyTile });
    }
    rows.push(row);
  }

  return {
    dimensions,
    rows,
    type,
  };
};

export const createWorld = (dimensions: Dimensions): World => {
  return {
    dimensions,
    setMap: createEmptyTileMap(dimensions, "set"),
    propsMap: createEmptyTileMap(dimensions, "props"),
    charactersMap: createEmptyTileMap(dimensions, "characters"),
  };
};

// Helper function to get a tile at specific coordinates
export const getTileAt = (tileMap: TileMap, x: number, y: number): Tile | null => {
  if (x < 0 || x >= tileMap.dimensions.width || 
      y < 0 || y >= tileMap.dimensions.height) {
    return null;
  }
  return tileMap.rows[y][x];
};

// Helper function to set a tile at specific coordinates
export const setTileAt = (tileMap: TileMap, x: number, y: number, tile: Tile): boolean => {
  if (x < 0 || x >= tileMap.dimensions.width || 
      y < 0 || y >= tileMap.dimensions.height) {
    return false;
  }
  tileMap.rows[y][x] = { ...tile }; // Create a copy
  return true;
};

// Common tile presets for convenience
export const TILE_PRESETS = {
  empty: createTile("empty", " "),
  grass: createTile("grass", ",,,"),
  stone: createTile("stone", "###"),
  water: createTile("water", "~~~"),
  wall: createTile("wall", "|||"),
  player: createTile("player", "@"),
  switch: createTile("switch", "[O]", {
    states: ["default", "on", "off"],
    currentState: "default"
  }),
} as const;