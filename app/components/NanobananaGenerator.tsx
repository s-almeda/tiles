// app/components/NanobananaGenerator.tsx
'use client';

import { useState } from 'react';
import { useNanobanana } from '../hooks/useNanobanana';

interface NanobananaGeneratorProps {
  className?: string;
}

export default function NanobananaGenerator({ className = '' }: NanobananaGeneratorProps) {
  const [imagePath, setImagePath] = useState('colors.jpg');
  const [customPrompt, setCustomPrompt] = useState('');
  const { generateContent, loading, error, result } = useNanobanana();

  const handleGenerate = async () => {
    if (!imagePath.trim()) {
      alert('Please enter an image path');
      return;
    }
    
    await generateContent(imagePath, customPrompt || undefined);
  };

  return (
    <div className={`nanobanana-generator p-4 border rounded-lg ${className}`}>
      <h3 className="text-lg font-nintendo-ds mb-4">🍌 Nanobanana Generator</h3>
      
      <div className="space-y-3">
        <div>
          <label htmlFor="image-path" className="block text-sm font-nintendo-ds mb-1">
            Image Path (relative to public folder):
          </label>
          <input
            id="image-path"
            type="text"
            value={imagePath}
            onChange={(e) => setImagePath(e.target.value)}
            placeholder="e.g., cat_image.png"
            className="w-full px-3 py-2 border rounded font-nintendo-ds text-sm"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="custom-prompt" className="block text-sm font-nintendo-ds mb-1">
            Custom Prompt (optional):
          </label>
          <textarea
            id="custom-prompt"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Create a picture of my cat eating a nano-banana..."
            className="w-full px-3 py-2 border rounded font-nintendo-ds text-sm h-20"
            disabled={loading}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded font-nintendo-ds text-sm hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Nanobanana Content'}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 rounded">
          <p className="text-red-700 font-nintendo-ds text-sm">Error: {error}</p>
        </div>
      )}

      {result && (
        <div className="mt-4 space-y-3">
          {result.textParts.length > 0 && (
            <div>
              <h4 className="font-nintendo-ds font-bold mb-2">Generated Text:</h4>
              {result.textParts.map((text, index) => (
                <p key={index} className="text-sm font-nintendo-ds p-2 bg-gray-100 rounded">
                  {text}
                </p>
              ))}
            </div>
          )}

          {result.images.length > 0 && (
            <div>
              <h4 className="font-nintendo-ds font-bold mb-2">Generated Images:</h4>
              <div className="grid grid-cols-2 gap-2">
                {result.images.map((imagePath, index) => (
                  <div key={index} className="border rounded p-2">
                    <img 
                      src={imagePath} 
                      alt={`Generated ${index + 1}`}
                      className="w-full h-auto rounded"
                    />
                    <p className="text-xs font-nintendo-ds mt-1 text-gray-600">
                      {imagePath}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}