import React, { useState } from 'react';
import FileUpload from './FileUpload';
import ExtractionProgress from './ExtractionProgress';
import DataOutput from './DataOutput';
import ApiDebugger from './ApiDebugger';

const UploadExtractFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [extractedData, setExtractedData] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [apiCalls, setApiCalls] = useState([]);
  const [createdObjects, setCreatedObjects] = useState([]);

  const addApiCall = (call) => {
    setApiCalls(prev => [...prev, { ...call, timestamp: new Date().toISOString() }]);
  };

  const handleFilesUploaded = (files) => {
    setUploadedFiles(files);
    setCurrentStep(2);
  };

  const handleExtraction = async () => {
    setIsExtracting(true);
    
    try {
      // Step 1: Upload data
      const objectName = `uploaded_data_${Date.now()}`;
      const fileContents = await Promise.all(
        uploadedFiles.map(file => file.text())
      );

      const uploadCall = {
        endpoint: '/input_data',
        method: 'POST',
        payload: {
          created_object_name: objectName,
          data_type: 'strings',
          input_data: fileContents
        }
      };

      addApiCall(uploadCall);

      const uploadResponse = await fetch('https://staging.impromptu-labs.com/api_tools/input_data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 37fe7c79edf25f42__-__sean'
        },
        body: JSON.stringify(uploadCall.payload)
      });

      const uploadResult = await uploadResponse.json();
      addApiCall({ ...uploadCall, response: uploadResult });

      // Step 2: Apply extraction prompt
      const extractObjectName = `extracted_${Date.now()}`;
      const promptCall = {
        endpoint: '/apply_prompt',
        method: 'POST',
        payload: {
          created_object_names: [extractObjectName],
          prompt_string: 'Extract key information and structure from this data: {input_data}',
          inputs: [{
            object_name: objectName,
            processing_mode: 'combine_events'
          }]
        }
      };

      addApiCall(promptCall);

      const promptResponse = await fetch('https://staging.impromptu-labs.com/api_tools/apply_prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 37fe7c79edf25f42__-__sean'
        },
        body: JSON.stringify(promptCall.payload)
      });

      const promptResult = await promptResponse.json();
      addApiCall({ ...promptCall, response: promptResult });

      // Step 3: Retrieve extracted data
      const retrieveCall = {
        endpoint: `/return_data/${extractObjectName}`,
        method: 'GET'
      };

      addApiCall(retrieveCall);

      const dataResponse = await fetch(`https://staging.impromptu-labs.com/api_tools/return_data/${extractObjectName}`, {
        headers: {
          'Authorization': 'Bearer 37fe7c79edf25f42__-__sean'
        }
      });

      const dataResult = await dataResponse.json();
      addApiCall({ ...retrieveCall, response: dataResult });

      setExtractedData(dataResult.text_value);
      setCreatedObjects([objectName, extractObjectName]);
      setCurrentStep(3);
    } catch (error) {
      console.error('Extraction failed:', error);
      addApiCall({ error: error.message });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleCancel = () => {
    setIsExtracting(false);
    setCurrentStep(1);
    setUploadedFiles([]);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setUploadedFiles([]);
    setExtractedData(null);
    setApiCalls([]);
    setCreatedObjects([]);
  };

  const handleDeleteObjects = async () => {
    for (const objectName of createdObjects) {
      try {
        const deleteCall = {
          endpoint: `/objects/${objectName}`,
          method: 'DELETE'
        };

        addApiCall(deleteCall);

        const response = await fetch(`https://staging.impromptu-labs.com/api_tools/objects/${objectName}`, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer 37fe7c79edf25f42__-__sean'
          }
        });

        const result = await response.json();
        addApiCall({ ...deleteCall, response: result });
      } catch (error) {
        addApiCall({ error: error.message });
      }
    }
    setCreatedObjects([]);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Upload & Extract Flow
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              aria-label="Reset the flow"
            >
              Reset
            </button>
            {createdObjects.length > 0 && (
              <button
                onClick={handleDeleteObjects}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Delete created objects"
              >
                Delete Objects
              </button>
            )}
          </div>
        </div>
        
        <div className="flex items-center mb-6">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= step 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`flex-1 h-1 mx-2 ${
                  currentStep > step 
                    ? 'bg-primary-600' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          {currentStep === 1 && (
            <FileUpload onFilesUploaded={handleFilesUploaded} />
          )}
          
          {currentStep === 2 && (
            <ExtractionProgress 
              isExtracting={isExtracting}
              onExtract={handleExtraction}
              onCancel={handleCancel}
            />
          )}
          
          {currentStep === 3 && (
            <DataOutput data={extractedData} />
          )}
        </div>

        <div className="lg:col-span-4">
          <ApiDebugger apiCalls={apiCalls} />
        </div>
      </div>
    </div>
  );
};

export default UploadExtractFlow;
