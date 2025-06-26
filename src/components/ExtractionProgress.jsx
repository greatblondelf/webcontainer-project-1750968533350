import React from 'react';

const ExtractionProgress = ({ isExtracting, onExtract, onCancel }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Step 2: Extract Data
      </h3>
      
      <div className="text-center space-y-6">
        {isExtracting ? (
          <>
            <div className="spinner mx-auto"></div>
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                Extracting data...
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                This may take a few moments
              </p>
            </div>
            <button
              onClick={onCancel}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Cancel extraction"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <div className="text-6xl text-gray-400 dark:text-gray-500">⚡</div>
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                Ready to extract data
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Click the button below to start processing your files
              </p>
            </div>
            <button
              onClick={onExtract}
              className="px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="Start data extraction"
            >
              Start Extraction
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ExtractionProgress;
