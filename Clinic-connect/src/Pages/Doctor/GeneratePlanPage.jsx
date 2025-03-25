import { useState, useEffect } from 'react';
import { FiSearch, FiUser, FiPlusCircle, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

const GeneratePlanPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [medicalPrompt, setMedicalPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState('');

  // Mock patient data - replace with API call
  const mockPatients = [
    { id: 1, name: 'Sarah Johnson', age: 34, conditions: ['Hypertension', 'Type 2 Diabetes'] },
    { id: 2, name: 'Michael Chen', age: 45, conditions: ['Asthma', 'Obesity'] },
    { id: 3, name: 'Emma Wilson', age: 28, conditions: ['Migraine', 'Anxiety'] },
  ];

  // Search handler
  const handleSearch = (query) => {
    setSearchQuery(query);
    // Implement real search logic here
    const filtered = mockPatients.filter(patient =>
      patient.name.toLowerCase().includes(query.toLowerCase())
    );
    setPatients(filtered);
  };

  // Generate handler
  const handleGenerate = async () => {
    try {
      setIsLoading(true);
      // Implement AI generation logic
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Navigate to draft page after generation
    } catch (err) {
      setError('Failed to generate plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mr-4">AI Healthcare Plan Generator</h1>
          <div className="h-1 w-16 bg-blue-600 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Patient Selection Column */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 h-[600px]"
          >
            <div className="relative mb-6">
              <FiSearch className="absolute left-3 top-4 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-4 overflow-y-auto h-[500px]">
              {patients.map(patient => (
                <motion.div
                  key={patient.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-xl cursor-pointer transition-colors ${
                    selectedPatient?.id === patient.id
                      ? 'bg-blue-50 border-2 border-blue-500'
                      : 'hover:bg-gray-50 border-2 border-transparent'
                  }`}
                  onClick={() => setSelectedPatient(patient)}
                >
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-lg mr-4">
                      <FiUser className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                      <p className="text-sm text-gray-600">
                        {patient.age} years • {patient.conditions.join(', ')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* AI Prompt Column */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 h-[600px] flex flex-col"
          >
            {selectedPatient ? (
              <>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Clinical Guidance</h2>
                    <span className="text-sm text-gray-600">
                      {medicalPrompt.length}/2000 characters
                    </span>
                  </div>
                  <textarea
                    value={medicalPrompt}
                    onChange={(e) => setMedicalPrompt(e.target.value.slice(0, 2000))}
                    placeholder="Provide clinical context, treatment goals, and special considerations..."
                    className="w-full h-48 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="mt-auto">
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Quick Prompts
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        'Create a diabetes management plan',
                        'Develop post-surgery recovery',
                        'Chronic pain management strategy',
                        'Mental health improvement plan'
                      ].map(prompt => (
                        <button
                          key={prompt}
                          onClick={() => setMedicalPrompt(prompt)}
                          className="text-left p-3 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 text-sm text-gray-700 transition-colors"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={!medicalPrompt || isLoading}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl text-white font-medium flex items-center justify-center transition-all"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <span className="animate-spin mr-2">🌀</span>
                        Generating...
                      </div>
                    ) : (
                      <>
                        Generate Plan Draft
                        <FiArrowRight className="ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <FiPlusCircle className="text-gray-400 mb-4" size={48} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Select a Patient
                </h3>
                <p className="text-gray-600 max-w-xs">
                  Choose a patient from the list to begin creating their personalized healthcare plan
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 right-6 bg-red-50 text-red-700 px-6 py-3 rounded-xl shadow-lg flex items-center"
          >
            <span>⚠️</span>
            <span className="ml-2">{error}</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GeneratePlanPage;