import { useState } from 'react';
import { CloudArrowUpIcon, DocumentTextIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const PatientRecordManagement = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [files, setFiles] = useState([]);
  const [documentType, setDocumentType] = useState('');
  const [notes, setNotes] = useState('');

  // Mock data for view tab
  const mockFiles = [
    { id: 1, name: 'Blood_Test.pdf', date: '2024-03-15', size: 2.4 },
    { id: 2, name: 'XRay_Scan.jpg', date: '2024-03-14', size: 5.1 },
  ];

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...newFiles]);
  };


  const handleCancel = () => {
    setFiles([]);
    setDocumentType('');
    setNotes('');
  };

  const handleContinue = () => {
    // Add your submission logic here
    console.log('Submitting:', { files, documentType, notes });
  };

  return (
    <div className="max-w-6xl mx-auto p-5 min-h-screen bg-gray-100">
      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('upload')}
          className={`pb-2 px-4 ${
            activeTab === 'upload' 
              ? 'border-b-2 border-blue-600 text-blue-600 font-medium' 
              : 'text-gray-500 hover:text-blue-500'
          }`}
        >
          Upload Records
        </button>
        <button
          onClick={() => setActiveTab('view')}
          className={`pb-2 px-4 ${
            activeTab === 'view' 
              ? 'border-b-2 border-blue-600 text-blue-600 font-medium' 
              : 'text-gray-500 hover:text-blue-500'
          }`}
        >
          View Records
        </button>
      </div>

      {/* Upload Tab Content */}
      {activeTab === 'upload' && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Upload Form - Keep your existing upload UI */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Upload Medical Records</h2>
          
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes for Doctor
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any specific concerns"
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="4"
            />
          </div>

          {/* File Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg mb-5"
              >
                <option value="">Select Document Type</option>
                <option value="lab-report">Lab Report</option>
                <option value="prescription">Prescription</option>
              </select>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500">
                <input
                  type="file"
                  id="fileInput"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.jpg,.png"
                />
                <label htmlFor="fileInput" className="cursor-pointer">
                  <CloudArrowUpIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-700">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500 mt-1">PDF, JPG, PNG (MAX 25MB)</p>
                </label>
              </div>
            </div>

            {/* Right Column - Enhanced Guidelines */}
            <div className="border-l-2 border-gray-200 pl-8">
              <div className="sticky top-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Guidelines</h3>
                <div className="space-y-4 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Accepted formats: PDF, JPG, PNG (Max 25MB per file)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Ensure personal information is clearly visible</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Scan documents in proper lighting</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Prescriptions should include doctor details</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Lab reports must have date and patient ID</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end gap-4">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleContinue}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={files.length === 0}
            >
              Upload Records
            </button>
          </div>
        </div>
      )}

      {/* View Tab Content */}
      {activeTab === 'view' && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Medical Records</h2>
          
          {/* Search and Filters */}
          <div className="mb-6 flex gap-4">
            <input
              type="text"
              placeholder="Search records..."
              className="flex-1 p-2 border border-gray-200 rounded-lg"
            />
            <select className="p-2 border border-gray-200 rounded-lg">
              <option>All Types</option>
              <option>Lab Reports</option>
              <option>Prescriptions</option>
            </select>
          </div>

          {/* Files Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockFiles.map(file => (
              <div key={file.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg">
                <div className="flex items-center mb-2">
                  <DocumentTextIcon className="w-6 h-6 text-blue-500 mr-2" />
                  <h3 className="font-medium truncate">{file.name}</h3>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{file.date}</span>
                  <span>{file.size} MB</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="text-blue-500 hover:text-blue-700">
                    Preview
                  </button>
                  <button className="text-gray-500 hover:text-gray-700">
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientRecordManagement;