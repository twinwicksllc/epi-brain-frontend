'use client';

import { useState } from 'react';

export default function TestConnection() {
  const [results, setResults] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runTests = async () => {
    setTesting(true);
    setResults([]);

    // Test 1: Check if we can reach the API domain
    addResult('🔍 Testing DNS resolution...');
    try {
      const response = await fetch('https://api.epibraingenius.com/health', {
        method: 'GET',
        mode: 'cors',
      });
      addResult(`✅ DNS resolved! Status: ${response.status}`);
      const data = await response.json();
      addResult(`✅ Health check response: ${JSON.stringify(data)}`);
    } catch (error: any) {
      addResult(`❌ DNS/Health check failed: ${error.message}`);
    }

    // Test 2: Check localStorage
    addResult('🔍 Checking authentication token...');
    const token = localStorage.getItem('access_token');
    if (token) {
      addResult(`✅ Token exists (length: ${token.length})`);
    } else {
      addResult('❌ No authentication token found');
    }

    // Test 3: Test authenticated request
    if (token) {
      addResult('🔍 Testing authenticated API call...');
      try {
        const response = await fetch('https://api.epibraingenius.com/api/v1/chat/conversations', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        addResult(`✅ API call status: ${response.status}`);
        if (response.ok) {
          const data = await response.json();
          addResult(`✅ API response: ${JSON.stringify(data).substring(0, 100)}...`);
        } else {
          const text = await response.text();
          addResult(`❌ API error: ${text.substring(0, 200)}`);
        }
      } catch (error: any) {
        addResult(`❌ API call failed: ${error.message}`);
      }
    }

    // Test 4: Network info
    addResult('🔍 Network information...');
    if (typeof navigator !== 'undefined') {
      addResult(`📱 User Agent: ${navigator.userAgent.substring(0, 100)}`);
      if ('connection' in navigator) {
        const conn = (navigator as any).connection;
        addResult(`📶 Connection type: ${conn?.effectiveType || 'unknown'}`);
        addResult(`📶 Downlink: ${conn?.downlink || 'unknown'} Mbps`);
      }
    }

    setTesting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] to-[#2d1b4e] p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Connection Test</h1>
        
        <button
          onClick={runTests}
          disabled={testing}
          className="px-6 py-3 bg-[#7B3FF2] text-white rounded-lg hover:bg-[#6B2FE2] disabled:opacity-50 disabled:cursor-not-allowed mb-6"
        >
          {testing ? 'Testing...' : 'Run Connection Tests'}
        </button>

        <div className="bg-[#2d1b4e] border border-[#7B3FF2]/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Test Results:</h2>
          <div className="space-y-2 font-mono text-sm">
            {results.length === 0 ? (
              <p className="text-gray-400">Click "Run Connection Tests" to start</p>
            ) : (
              results.map((result, index) => (
                <div
                  key={index}
                  className={`p-2 rounded ${
                    result.includes('✅') ? 'bg-green-500/10 text-green-400' :
                    result.includes('❌') ? 'bg-red-500/10 text-red-400' :
                    'bg-blue-500/10 text-blue-400'
                  }`}
                >
                  {result}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-6">
          <a
            href="/dashboard"
            className="text-[#A78BFA] hover:text-[#7B3FF2] underline"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}