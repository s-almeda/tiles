// app/World.tsx
import { World as WorldType, TileMap, Tile as TileType } from './tiles'
import Tile from './Tile'

type LayerMode = 'on' | 'off' | 'disabled';
type LayerType = 'set' | 'props' | 'characters';

interface LayerConfig {
  type: LayerType;
  mode: LayerMode;
}

interface WorldProps {
  world: WorldType;
  onTileClick?: (x: number, y: number, tile: TileType, layer: LayerType) => void;
  onTileHover?: (x: number, y: number, tile: TileType, layer: LayerType) => void;
  viewMode?: 'layered' | 'separated';
  layers: {
    set: LayerConfig;
    props: LayerConfig;
    characters: LayerConfig;
  };
}

interface TileMapProps {
  tileMap: TileMap;
  layerConfig: LayerConfig;
  onTileClick?: (x: number, y: number, tile: TileType) => void;
  onTileHover?: (x: number, y: number, tile: TileType) => void;
  zIndex?: number;
  title?: string;
}

function TileMapRenderer({ tileMap, layerConfig, onTileClick, onTileHover, zIndex = 0, title }: TileMapProps) {
  // Don't render if layer is off or disabled
  if (layerConfig.mode === 'off' || layerConfig.mode === 'disabled') {
    return null;
  }

  return (
    <div className="tile-map-container">
      {title && (
        <h3 style={{ 
          margin: '0 0 10px 0', 
          fontSize: '14px', 
          textAlign: 'center',
          textTransform: 'capitalize'
        }}>
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
          gridTemplateColumns: `repeat(${tileMap.dimensions.width}, 32px)`,
          gridTemplateRows: `repeat(${tileMap.dimensions.height}, 32px)`,
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
            />
          ))
        )}
      </div>
    </div>
  );
}

export default function World({ 
  world, 
  onTileClick, 
  onTileHover,
  viewMode = 'layered',
  layers
}: WorldProps) {
  const handleTileClick = (layer: LayerType) => (x: number, y: number, tile: TileType) => {
    if (onTileClick) onTileClick(x, y, tile, layer);
  };

  const handleTileHover = (layer: LayerType) => (x: number, y: number, tile: TileType) => {
    if (onTileHover) onTileHover(x, y, tile, layer);
  };

  const getVisibleLayers = () => {
    return Object.entries(layers)
      .filter(([_, config]) => config.mode === 'on')
      .map(([name, config]) => ({ name: name as LayerType, config }));
  };

  if (viewMode === 'separated') {
    return (
      <div className="world-separated">
        <div 
          style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
          {/* Render each layer separately */}
          <TileMapRenderer
            tileMap={world.setTileMap}
            layerConfig={layers.set}
            onTileClick={handleTileClick('set')}
            onTileHover={handleTileHover('set')}
            title="Set"
          />

          <TileMapRenderer
            tileMap={world.propsTileMap}
            layerConfig={layers.props}
            onTileClick={handleTileClick('props')}
            onTileHover={handleTileHover('props')}
            title="Props"
          />

          <TileMapRenderer
            tileMap={world.charactersTileMap}
            layerConfig={layers.characters}
            onTileClick={handleTileClick('characters')}
            onTileHover={handleTileHover('characters')}
            title="Characters"
          />
        </div>
      </div>
    );
  }

  // Layered mode
  return (
    <div className="world-layered">
      <div 
        className="world-container"
        style={{
          position: 'relative',
          width: `${world.dimensions.width * 32}px`,
          height: `${world.dimensions.height * 32}px`,
          border: '2px solid #333',
          margin: '20px auto'
        }}
      >
        {/* Set layer (background) */}
        <TileMapRenderer
          tileMap={world.setTileMap}
          layerConfig={layers.set}
          onTileClick={handleTileClick('set')}
          onTileHover={handleTileHover('set')}
          zIndex={1}
        />

        {/* Props layer (middle) */}
        <TileMapRenderer
          tileMap={world.propsTileMap}
          layerConfig={layers.props}
          onTileClick={handleTileClick('props')}
          onTileHover={handleTileHover('props')}
          zIndex={2}
        />

        {/* Characters layer (top) */}
        <TileMapRenderer
          tileMap={world.charactersTileMap}
          layerConfig={layers.characters}
          onTileClick={handleTileClick('characters')}
          onTileHover={handleTileHover('characters')}
          zIndex={3}
        />
      </div>

      {/* Debug info */}
      <div style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: '12px' }}>
        <p>Dimensions: {world.dimensions.width} x {world.dimensions.height}</p>
        <p>Active Layers: {getVisibleLayers().map(l => l.name).join(', ')}</p>
      </div>
    </div>
  );
}