'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { World, Tile } from './tiles'

type AppMode = 'display' | 'edit'

interface AppContextType {
  // Current world state
  world: World | null
  isLoading: boolean
  error: string | null
  
  // App mode
  mode: AppMode
  setMode: (mode: AppMode) => void
  
  // World management
  loadWorld: (worldName: string) => Promise<void>
  updateTile: (layer: 'set' | 'props' | 'characters', x: number, y: number, tile: Tile) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  const [world, setWorld] = useState<World | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<AppMode>('display')

  // Load world from JSON file
  const loadWorld = async (worldName: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/${worldName}.json`)
      if (!response.ok) {
        throw new Error(`Failed to load ${worldName}.json: ${response.statusText}`)
      }
      
      const worldData = await response.json()
      
      // Validate and normalize the world data
      const loadedWorld: World = {
        dimensions: worldData.dimensions,
        setTileMap: {
          dimensions: worldData.dimensions,
          rows: worldData.setTileMap.rows.map((row: any[]) => 
            row.map((tile: any) => normalizeTime(tile))
          ),
          type: 'set'
        },
        propsTileMap: {
          dimensions: worldData.dimensions,
          rows: worldData.propsTileMap.rows.map((row: any[]) => 
            row.map((tile: any) => normalizeTime(tile))
          ),
          type: 'props'
        },
        charactersTileMap: {
          dimensions: worldData.dimensions,
          rows: worldData.charactersTileMap.rows.map((row: any[]) => 
            row.map((tile: any) => normalizeTime(tile))
          ),
          type: 'characters'
        }
      }
      
      setWorld(loadedWorld)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error loading world'
      setError(errorMessage)
      console.error('Error loading world:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Normalize tile data from JSON (add default values)
  const normalizeTime = (tileData: any): Tile => {
    return {
      name: tileData.name,
      glyph: tileData.glyph,
      image: tileData.image,
      states: tileData.states || ['default'],
      currentState: tileData.currentState || 'default'
    }
  }

  // Update a single tile in the world
  const updateTile = (layer: 'set' | 'props' | 'characters', x: number, y: number, tile: Tile) => {
    if (!world) return
    
    const newWorld = { ...world }
    const targetMap = layer === 'set' ? newWorld.setTileMap : 
                     layer === 'props' ? newWorld.propsTileMap : 
                     newWorld.charactersTileMap
    
    // Bounds checking
    if (x < 0 || x >= targetMap.dimensions.width || 
        y < 0 || y >= targetMap.dimensions.height) {
      console.warn(`updateTile: coordinates (${x}, ${y}) out of bounds`)
      return
    }
    
    // Create new rows array with updated tile
    targetMap.rows = targetMap.rows.map((row, rowIndex) => 
      rowIndex === y 
        ? row.map((currentTile, colIndex) => colIndex === x ? { ...tile } : currentTile)
        : row
    )
    
    setWorld(newWorld)
  }

  // Load default world on mount
  useEffect(() => {
    loadWorld('world0')
  }, [])

  const contextValue: AppContextType = {
    world,
    isLoading,
    error,
    mode,
    setMode,
    loadWorld,
    updateTile
  }

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}

// Hook to use the app context
export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export default AppContext