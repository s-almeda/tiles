//tiles.ts
//Tile types and util functions

// Basic dimension interface for consistent sizing
export interface Dimensions {
  width: number;
  height: number;
}

// Core Tile type
export interface Tile {
  name: string;
  image?: string; // Optional, defaults to none
  glyph: string; // Visual representation like ",,," for grass
  states: string[]; // Available states, defaults to ["default"]
  currentState: string; // Current state, defaults to "default"
}

// TileMap type options
// there are 3 kinds of tile maps in a world, the set, the props, and the characters
export type TileMapType = "set" | "props" | "characters";

// TileMap - a 2D grid of tiles
export interface TileMap {
  dimensions: Dimensions;
  rows: Tile[][]; // Array of rows, each row is an array of tiles
  type: TileMapType;
}

// World - contains three aligned TileMaps
export interface World {
  dimensions: Dimensions;
  setTileMap: TileMap;
  propsTileMap: TileMap;
  charactersTileMap: TileMap;
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
  type: TileMapType,
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
    setTileMap: createEmptyTileMap(dimensions, "set"),
    propsTileMap: createEmptyTileMap(dimensions, "props"),
    charactersTileMap: createEmptyTileMap(dimensions, "characters"),
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