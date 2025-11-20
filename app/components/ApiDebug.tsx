// app/components/ApiDebug.tsx
'use client';

import { useState, useEffect } from 'react';

export default function ApiDebug() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkApiStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/nanobanana');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      setStatus({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkApiStatus();
  }, []);

  return (
    <div className="p-4 bg-gray-100 border rounded-lg mb-4">
      <h3 className="font-nintendo-ds font-bold mb-2">🐛 API Debug Info</h3>
      
      <button 
        onClick={checkApiStatus}
        disabled={loading}
        className="px-3 py-1 bg-blue-500 text-white rounded text-sm font-nintendo-ds mb-2"
      >
        {loading ? 'Checking...' : 'Refresh Status'}
      </button>

      {status && (
        <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-40">
          {JSON.stringify(status, null, 2)}
        </pre>
      )}
    </div>
  );
}