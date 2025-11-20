// app/TileWorld.tsx
import TileMap, { LayerConfig, TileType, LayerType, TileMapData, Dimensions } from './TileMap'

// TileWorld - Contains several layers of TileMaps that overlay each other
interface TileWorldType {
  dimensions: Dimensions;
  setMap: TileMapData;      // Background layer (terrain, etc.)
  propsMap: TileMapData;    // Props layer (objects, switches, etc.)
  charactersMap: TileMapData; // Characters layer (players, NPCs, etc.)
}

type LayerMode = 'on' | 'off' | 'disabled';

interface TileWorldProps {
  world: TileWorldType;
  onTileClick?: (x: number, y: number, tile: TileType, layer: LayerType) => void;
  onTileHover?: (x: number, y: number, tile: TileType, layer: LayerType) => void;
  viewMode?: 'layered' | 'separated';
  layers: {
    set: LayerConfig;
    props: LayerConfig;
    characters: LayerConfig;
  };
  tileSize?: number; // Size in pixels, default 160
}

export default function TileWorld({ 
  world, 
  onTileClick, 
  onTileHover,
  viewMode = 'layered',
  layers,
  tileSize = 160
}: TileWorldProps) {
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
      <div className="tileworld-separated">
        <div 
          style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
          {/* Render each layer separately */}
          <TileMap
            tileMap={world.setMap}
            layerConfig={layers.set}
            onTileClick={handleTileClick('set')}
            onTileHover={handleTileHover('set')}
            title="Set"
            tileSize={tileSize}
          />

          <TileMap
            tileMap={world.propsMap}
            layerConfig={layers.props}
            onTileClick={handleTileClick('props')}
            onTileHover={handleTileHover('props')}
            title="Props"
            tileSize={tileSize}
          />

          <TileMap
            tileMap={world.charactersMap}
            layerConfig={layers.characters}
            onTileClick={handleTileClick('characters')}
            onTileHover={handleTileHover('characters')}
            title="Characters"
            tileSize={tileSize}
          />
        </div>
      </div>
    );
  }

  // Layered mode
  return (
    <div className="tileworld-layered">
      <div 
        className="tileworld-container"
        style={{
          position: 'relative',
          width: `${world.dimensions.width * tileSize}px`,
          height: `${world.dimensions.height * tileSize}px`,
          border: '2px solid #333',
          margin: '20px auto'
        }}
      >
        {/* Set layer (background) */}
        <TileMap
          tileMap={world.setMap}
          layerConfig={layers.set}
          onTileClick={handleTileClick('set')}
          onTileHover={handleTileHover('set')}
          zIndex={1}
          tileSize={tileSize}
        />

        {/* Props layer (middle) */}
        <TileMap
          tileMap={world.propsMap}
          layerConfig={layers.props}
          onTileClick={handleTileClick('props')}
          onTileHover={handleTileHover('props')}
          zIndex={2}
          tileSize={tileSize}
        />

        {/* Characters layer (top) */}
        <TileMap
          tileMap={world.charactersMap}
          layerConfig={layers.characters}
          onTileClick={handleTileClick('characters')}
          onTileHover={handleTileHover('characters')}
          zIndex={3}
          tileSize={tileSize}
        />
      </div>

      {/* Debug info */}
      <div className="text-center text-sm font-nintendo-ds">
        <p>Dimensions: {world.dimensions.width} x {world.dimensions.height}</p>
        <p>Active Layers: {getVisibleLayers().map(l => l.name).join(', ')}</p>
      </div>
    </div>
  );
}

export type { TileWorldType, TileWorldProps };