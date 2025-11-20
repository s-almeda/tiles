// app/TileMap.tsx
// a grid of tiles representing a single layer (e.g., set, props, characters)
import Tile from './Tile'
import {TileType} from './Tile'  // Import TileType from Tile.tsx

// Basic dimension interface for consistent sizing
interface Dimensions {
  width: number;
  height: number;
}

// Layer type options - there are 3 kinds of layers in a world
type LayerType = "set" | "props" | "characters";

// TileMap - A LAYER of tiles as a 2D array (this is what gets rendered as one layer)
interface TileMapData {
  dimensions: Dimensions;
  rows: TileType[][]; // Array of rows, each row is an array of tiles
  type: LayerType;
}

type LayerMode = 'on' | 'off' | 'disabled';

interface LayerConfig {
  type: LayerType;
  mode: LayerMode;
}

interface TileMapProps {
  tileMap: TileMapData;
  layerConfig: LayerConfig;
  onTileClick?: (x: number, y: number, tile: TileType) => void;
  onTileHover?: (x: number, y: number, tile: TileType) => void;
  zIndex?: number;
  title?: string;
  tileSize?: number; // Size in pixels, default 160
}

export default function TileMap({ 
  tileMap, 
  layerConfig, 
  onTileClick, 
  onTileHover, 
  zIndex = 0, 
  title,
  tileSize = 160
}: TileMapProps) {
  // Don't render if layer is off or disabled
  if (layerConfig.mode === 'off' || layerConfig.mode === 'disabled') {
    return null;
  }

  return (
    <div className="tile-map-container">
      {title && (
        <h3 className="mb-2 text-lg text-center capitalize font-nintendo">
          {title}
        </h3>
      )}
      <div
        className="tile-map"
        style={{
          position: title ? 'relative' : 'absolute',
          top: title ? 'auto' : 0,
          left: title ? 'auto' : 0,
          zIndex,
          display: 'grid',
          gridTemplateColumns: `repeat(${tileMap.dimensions.width}, ${tileSize}px)`,
          gridTemplateRows: `repeat(${tileMap.dimensions.height}, ${tileSize}px)`,
          gap: '0px',
          border: title ? '1px solid #666' : 'none',
        }}
      >
        {tileMap.rows.map((row, y) =>
          row.map((tile, x) => (
            <Tile
              key={`${x}-${y}`}
              tile={tile}
              x={x}
              y={y}
              onClick={onTileClick}
              onHover={onTileHover}
              tileSize={tileSize}
            />
          ))
        )}
      </div>
    </div>
  );
}

export type { LayerConfig, TileMapProps, TileType, LayerType, TileMapData, Dimensions };