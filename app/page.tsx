'use client'

import { AppProvider, useApp } from './AppContext'
import TileWorld from './TileWorld'
import { Pencil } from 'lucide-react'
import { TileType } from './TileMap'
import NanobananaGenerator from './components/NanobananaGenerator';
import ApiDebug from './components/ApiDebug';
import Sprite from './components/Sprite';



// Use TileType from TileMap as Tile
type Tile = TileType;

function PageContent() {
  const { world, mode, setMode, isLoading, error, updateTile } = useApp()

  // Layer configuration - could move this to context later
  const layers = {
    set: { type: 'set' as const, mode: 'on' as const },
    props: { type: 'props' as const, mode: 'on' as const },
    characters: { type: 'characters' as const, mode: 'on' as const }
  }

  const handleTileClick = (x: number, y: number, tile: Tile, layer: string) => {
    console.log(`Clicked ${layer} layer at (${x}, ${y}):`, tile.name, `- State: ${tile.currentState}`)
    
    if (mode === 'display') {
      // In display mode, only allow switch interactions
      if (tile.name === 'switch' && layer === 'props') {
        const newTile = { ...tile }
        
        // Toggle switch state
        if (newTile.currentState === 'default') {
          newTile.currentState = 'on'
        } else if (newTile.currentState === 'on') {
          newTile.currentState = 'off'
        } else {
          newTile.currentState = 'default'
        }
        
        updateTile('props', x, y, newTile)
      }
    } else {
      // In edit mode, tiles could be edited (placeholder for now)
      console.log('Edit mode - tile editing would go here')
    }
  }

  const handleTileHover = (x: number, y: number, tile: Tile, layer: string) => {
    // Could show tooltip or highlight effects here
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-xl font-nintendo">
        Loading world...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-xl text-red-600 font-nintendo">
        Error: {error}
      </div>
    )
  }

  if (!world) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-xl font-nintendo">
        No world loaded
      </div>
    )
  }

  return (
    <>
      <ApiDebug />
      <NanobananaGenerator />
      
      {/* Sprite Demo */}
      <section style={{ marginBottom: '30px', padding: '20px', background: 'white', borderRadius: '8px' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>Interactive Sprite - Click and Hold!</h2>
        <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-end' }}>
          <div>
            <div style={{ marginBottom: '10px', fontSize: '14px' }}>Click and hold the sprite</div>
            <Sprite 
              name="idle" 
              frames={[2]} 
              height={160} 
              fps={12}
              onMouseDownAnimation={{ name: 'pickup', frames: [0, 1, 1, 2, 3] }}
              onMouseUpAnimation={{ name: 'putdown', frames: [0, 1, 1, 2, 3] }}
            />
          </div>
        </div>
      </section>
      
      {/* Separated Views */}
      <section style={{ marginBottom: '50px' }}>
        <TileWorld
          world={world}
          viewMode="separated"
          layers={layers}
          onTileClick={handleTileClick}
          onTileHover={handleTileHover}
          tileSize={32}
        />
      </section>

      {/* Layered View with Controls */}
      <section>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'flex-start',
          gap: '20px'
        }}>
          {/* Layered World */}
          <div style={{ position: 'relative' }}>
            <TileWorld
              world={world}
              viewMode="layered"
              layers={layers}
              onTileClick={handleTileClick}
              onTileHover={handleTileHover}
              tileSize={128}
            />
            
            {/* Mode indicator overlay */}
            {mode === 'edit' && (
              <div style={{
                position: 'absolute',
                top: '-5px',
                left: '-5px',
                right: '-5px',
                bottom: '-5px',
                border: '3px solid #FF9800',
                borderRadius: '8px',
                pointerEvents: 'none',
                boxShadow: '0 0 10px rgba(255, 152, 0, 0.5)'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-25px',
                  left: '0',
                  background: '#FF9800',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  EDIT MODE
                </div>
              </div>
            )}
          </div>

          {/* Control Section */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            alignItems: 'center'
          }}>
            {/* Edit Button */}
            {mode === 'display' && (
              <button
                onClick={() => setMode('edit')}
                style={{
                  background: '#fff',
                  border: '2px solid #ddd',
                  borderRadius: '50%',
                  color: '#000',
                  width: '48px',
                  height: '48px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                title="Edit Mode"
              >
                <Pencil size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Done button for edit mode */}
        {mode === 'edit' && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              onClick={() => setMode('display')}
              style={{
                background: '#4CAF50',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                padding: '12px 24px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Done
            </button>
          </div>
        )}
      </section>
    </>
  )
}

export default function Home() {
  return (
    <AppProvider>
      <main className="p-5 font-nintendo bg-gray-100 min-h-screen text-black">

        <PageContent />
      </main>
    </AppProvider>
  )
}