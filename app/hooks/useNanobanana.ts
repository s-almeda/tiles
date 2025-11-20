// app/hooks/useNanobanana.ts
import { useState } from 'react';

interface NanobananaResult {
  textParts: string[];
  images: string[];
}

interface UseNanobananaReturn {
  generateContent: (imagePath: string, prompt?: string) => Promise<NanobananaResult | null>;
  loading: boolean;
  error: string | null;
  result: NanobananaResult | null;
}

export function useNanobanana(): UseNanobananaReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<NanobananaResult | null>(null);

  const generateContent = async (imagePath: string, prompt?: string): Promise<NanobananaResult | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/nanobanana', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imagePath,
          prompt
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Response:', errorData);
        throw new Error(`API request failed: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setResult(data.results);
        return data.results;
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Nanobanana hook error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateContent,
    loading,
    error,
    result
  };
}