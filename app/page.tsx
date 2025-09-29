'use client'

import { AppProvider, useApp } from './AppContext'
import World from './World'
import { Tile } from './tiles'
import { Pencil } from 'lucide-react'

function GameContent() {
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
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        fontSize: '18px'
      }}>
        Loading world...
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        fontSize: '18px',
        color: '#f44336'
      }}>
        Error: {error}
      </div>
    )
  }

  if (!world) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        fontSize: '18px'
      }}>
        No world loaded
      </div>
    )
  }

  return (
    <>
      {/* Separated Views */}
      <section style={{ marginBottom: '50px' }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '20px',
          color: '#000',
          fontSize: '20px',
          fontWeight: 'bold'
        }}>
          Individual Layer Views
        </h2>
        <World
          world={world}
          viewMode="separated"
          layers={layers}
          onTileClick={handleTileClick}
          onTileHover={handleTileHover}
        />
      </section>

      {/* Layered View with Controls */}
      <section>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '20px',
          color: '#000',
          fontSize: '20px',
          fontWeight: 'bold'
        }}>
          Layered World View
        </h2>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'flex-start',
          gap: '20px'
        }}>
          {/* Layered World */}
          <div style={{ position: 'relative' }}>
            <World
              world={world}
              viewMode="layered"
              layers={layers}
              onTileClick={handleTileClick}
              onTileHover={handleTileHover}
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

      {/* Instructions */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#fff',
        border: '2px solid #333',
        borderRadius: '8px',
        maxWidth: '600px',
        margin: '30px auto 0',
        color: '#000'
      }}>
        <h3 style={{ color: '#000', marginBottom: '15px' }}>Instructions:</h3>
        <ul style={{ color: '#000', lineHeight: '1.6' }}>
          <li>Click on switches (in props layer) to toggle their state</li>
          <li>Top section shows each layer separately</li>
          <li>Bottom section shows all layers stacked together</li>
          <li>Click the pencil icon to enter edit mode</li>
          <li>In edit mode, the world has an orange border</li>
          <li>Click "Done" to exit edit mode</li>
          <li>Hover over tiles to see their names in tooltips</li>
        </ul>
      </div>
    </>
  )
}

export default function Home() {
  return (
    <AppProvider>
      <main style={{ 
        padding: '20px', 
        fontFamily: 'system-ui, sans-serif',
        backgroundColor: '#f0f0f0',
        minHeight: '100vh',
        color: '#000'
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '30px',
          color: '#000',
          fontSize: '28px',
          fontWeight: 'bold'
        }}>
          Tile World Demo
        </h1>

        <GameContent />
      </main>
    </AppProvider>
  )
}