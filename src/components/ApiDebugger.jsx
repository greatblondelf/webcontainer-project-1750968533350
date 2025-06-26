import React, { useState } from 'react';

const ApiDebugger = ({ apiCalls }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCall, setSelectedCall] = useState(null);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          API Debug Console
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label={isExpanded ? 'Collapse debug console' : 'Expand debug console'}
        >
          {isExpanded ? 'Collapse' : 'Show Raw Data'}
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {apiCalls.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No API calls made yet
          </p>
        ) : (
          apiCalls.map((call, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setSelectedCall(selectedCall === index ? null : index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded ${
                    call.method === 'POST' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    call.method === 'GET' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {call.method || 'ERROR'}
                  </span>
                  <span className="text-sm font-mono text-gray-900 dark:text-white">
                    {call.endpoint || 'Error'}
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {call.timestamp && new Date(call.timestamp).toLocaleTimeString()}
                </span>
              </div>
              
              {selectedCall === index && isExpanded && (
                <div className="mt-3 space-y-2">
                  {call.payload && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Request:
                      </h4>
                      <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-x-auto">
                        {JSON.stringify(call.payload, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  {call.response && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Response:
                      </h4>
                      <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-x-auto">
                        {JSON.stringify(call.response, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  {call.error && (
                    <div>
                      <h4 className="text-xs font-semibold text-red-700 dark:text-red-300 mb-1">
                        Error:
                      </h4>
                      <pre className="text-xs bg-red-100 dark:bg-red-900 p-2 rounded overflow-x-auto">
                        {call.error}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ApiDebugger;
