// app/Tile.tsx
import { Tile as TileType } from './tiles'

interface TileProps {
  tile: TileType;
  x?: number;
  y?: number;
  onClick?: (x: number, y: number, tile: TileType) => void;
  onHover?: (x: number, y: number, tile: TileType) => void;
}

export default function Tile({ tile, x = 0, y = 0, onClick, onHover }: TileProps) {
  const handleClick = () => {
    if (onClick) onClick(x, y, tile);
  };

  const handleMouseEnter = () => {
    if (onHover) onHover(x, y, tile);
  };

  return (
    <div
      className="tile"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      title={`${tile.name} (${tile.currentState})`}
      style={{
        width: '32px',
        height: '32px',
        border: '2px solid #333',
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