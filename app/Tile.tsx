// app/Tile.tsx
// a single tile

// Core Tile type - individual tile with visual and state data
export interface TileType {
  name: string;
  image?: string; // Optional, defaults to none
  glyph: string; // Visual representation like ",,," for grass
  states: string[]; // Available states, defaults to ["default"]
  currentState: string; // Current state, defaults to "default"
}

interface TileProps {
  tile: TileType;
  x?: number;
  y?: number;
  onClick?: (x: number, y: number, tile: TileType) => void;
  onHover?: (x: number, y: number, tile: TileType) => void;
  tileSize?: number; // Size in pixels, default 160
}

export default function Tile({ tile, x = 0, y = 0, onClick, onHover, tileSize = 160 }: TileProps) {
  const handleClick = () => {
    if (onClick) onClick(x, y, tile);
  };

  const handleMouseEnter = () => {
    if (onHover) onHover(x, y, tile);
  };

  const borderWidth = 2;
  const innerSize = tileSize - (borderWidth * 2);

  return (
    <div
      className="tile"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      title={`${tile.name} (${tile.currentState})`}
      style={{
        width: `${tileSize}px`,
        height: `${tileSize}px`,
        border: `${borderWidth}px solid #333`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'monospace',
        fontSize: '14px',
        fontWeight: 'bold',
        cursor: 'pointer',
        color: '#000',
        backgroundColor: tile.currentState === 'on' ? '#4CAF50' : 
                        tile.currentState === 'off' ? '#f44336' : 
                        tile.name === 'switch' ? '#fff' : 'transparent',
      }}
    >
      {tile.image ? (
        <img 
          src={tile.image} 
          alt={tile.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <span>{tile.glyph}</span>
      )}
    </div>
  );
}
