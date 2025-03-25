import { useState, useEffect } from 'react';
import { FiEdit, FiRefreshCw, FiCheckCircle, FiChevronRight, FiArrowRight, FiFileText } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const initialPlan = {
  id: 'DP-001',
  patientId: 'PT-78910',
  sections: {
    summary: '45-year-old male with history of hypertension and prediabetes...',
    medication: `1. Lisinopril 10mg daily\n2. Metformin 500mg twice daily`,
    therapy: 'Weekly dietary counseling sessions\nMonthly blood pressure monitoring',
    monitoring: 'Fasting blood glucose every 3 months\nRenal function tests annually'
  },
  versions: [
    {
      id: 'v1',
      timestamp: '2024-03-15T14:30:00Z',
      author: 'AI Generator',
      changes: 'Initial draft generated'
    },
    {
      id: 'v2',
      timestamp: '2024-03-15T15:45:00Z',
      author: 'Dr. Smith',
      changes: 'Adjusted medication dosage'
    }
  ]
};

const DraftPlanPage = () => {
  const [draftPlan, setDraftPlan] = useState(initialPlan);
  const [activeSection, setActiveSection] = useState('summary');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle');

  const sections = [
    { id: 'summary', label: 'Clinical Summary', icon: <FiFileText /> },
    { id: 'medication', label: 'Medication Plan', icon: <FiCheckCircle /> },
    { id: 'therapy', label: 'Therapy Protocol', icon: <FiRefreshCw /> },
    { id: 'monitoring', label: 'Monitoring Schedule', icon: <FiEdit /> }
  ];

  const handleUpdate = (section, e) => {
    const newContent = e.target.value;
    setDraftPlan(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: newContent
      }
    }));
    setSaveStatus('pending');
  };

  const handleSave = async () => {
    try {
      setSaveStatus('saving');
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
    }
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRegenerating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white rounded-2xl p-6 shadow-sm"
        >
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <span className="bg-blue-600 text-white p-2 rounded-lg">
                <FiFileText size={24} />
              </span>
              Treatment Plan Draft
            </h1>
            <p className="text-gray-600 mt-2">Patient ID: {draftPlan.patientId}</p>
          </div>
          
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="flex items-center text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-lg">
              <span className={`w-2 h-2 rounded-full mr-2 
                ${saveStatus === 'saved' ? 'bg-green-500' : 
                   saveStatus === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}
              />
              {saveStatus === 'saved' && 'Changes saved'}
              {saveStatus === 'saving' && 'Saving...'}
              {saveStatus === 'error' && 'Save failed'}
            </div>
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-all"
            >
              <FiCheckCircle className="shrink-0" /> 
              <span className="whitespace-nowrap">Save Draft</span>
            </button>
          </div>
        </motion.header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <nav className="lg:col-span-1 bg-white rounded-2xl shadow-sm p-4 h-fit lg:sticky lg:top-8">
            <h2 className="text-sm font-semibold text-gray-500 mb-4">SECTIONS</h2>
            <div className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left p-3 rounded-xl flex items-center justify-between transition-colors
                    ${activeSection === section.id 
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'hover:bg-gray-50 text-gray-700'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">{section.icon}</span>
                    {section.label}
                  </div>
                  <FiChevronRight className={`transform transition-transform ${
                    activeSection === section.id ? 'rotate-90' : 'rotate-0'
                  }`} />
                </button>
              ))}
            </div>
          </nav>

          {/* Content Editor */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {sections.find(s => s.id === activeSection)?.label}
              </h2>
              <button
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-2 disabled:opacity-50 px-4 py-2 bg-blue-50 rounded-lg"
              >
                <FiRefreshCw className={`shrink-0 ${isRegenerating ? 'animate-spin' : ''}`} />
                Regenerate Section
              </button>
            </div>

            <AnimatePresence mode='wait'>
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <textarea
                  value={draftPlan.sections[activeSection]}
                  onChange={(e) => handleUpdate(activeSection, e)}
                  className="w-full h-96 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Enter plan details..."
                />
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <button className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all">
                Proceed to Final Approval
                <FiArrowRight className="shrink-0" />
              </button>
            </div>
          </div>

          {/* Version History */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm p-6 h-fit lg:sticky lg:top-8">
            <h3 className="text-sm font-semibold text-gray-500 mb-4">VERSION HISTORY</h3>
            <div className="space-y-4">
              {draftPlan.versions.map((version, index) => (
                <motion.div
                  key={version.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Version {index + 1}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {new Date(version.timestamp).toLocaleDateString('en-CA', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="text-sm text-gray-500 mt-2">{version.author}</div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm p-2 -m-2">
                      Compare
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{version.changes}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraftPlanPage;