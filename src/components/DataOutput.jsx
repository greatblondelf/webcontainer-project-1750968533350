import React, { useState } from 'react';

const DataOutput = ({ data }) => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const downloadCSV = () => {
    const csvContent = data || 'No data available';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Step 3: Extracted Data
        </h3>
        <button
          onClick={downloadCSV}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label="Download extracted data as CSV"
        >
          Download CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-96 overflow-y-auto">
          <pre className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
            {data || 'No data extracted yet'}
          </pre>
        </div>
      </div>

      <div className="mt-6">
        <table className="table table-striped table-hover w-full">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={() => handleSort('field1')}
                aria-label="Sort by field 1"
              >
                Field 1
                {sortField === 'field1' && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={() => handleSort('field2')}
                aria-label="Sort by field 2"
              >
                Field 2
                {sortField === 'field2' && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                Sample Data 1
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                Sample Value 1
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm">
                <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                  View
                </button>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                Sample Data 2
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                Sample Value 2
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm">
                <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataOutput;
