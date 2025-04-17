import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiSearch, FiPlus } from 'react-icons/fi';
import ApiService from '../../../Service/ApiService';

const GeneratePlanPage = () => {
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState('');
  const [patientCondition, setPatientCondition] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const doctorId = localStorage.getItem('doctorId');
      
      if (!doctorId) {
        throw new Error('Doctor ID not found');
      }

      const formattedDoctorId = doctorId === '1' ? '123' : doctorId;

      // Send plain text condition
      const response = await ApiService.generateCarePlan(
        formattedDoctorId,
        patientId,
        patientCondition
      );

      if (response && response.carePlan && response.carePlan.id) {
        localStorage.setItem('currentCarePlanId', response.carePlan.id);
        navigate('/Doctor/DraftPlan');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/Doctor')}
            className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
          >
            <FiArrowLeft className="mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-blue-900">Generate New Care Plan</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient ID
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter patient ID"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient Condition
              </label>
              <textarea
                value={patientCondition}
                onChange={(e) => setPatientCondition(e.target.value)}
                className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Enter patient condition (e.g., Diabetes management plan for male patient, 36 years old with type 2 diabetes)"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading || !patientId || !patientCondition}
              className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <FiPlus className="mr-2" />
                  Generate Care Plan
                </>
              )}
            </button>
          </div>
        </motion.div>

        <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">Tips for Generating Care Plans</h2>
          <ul className="list-disc list-inside space-y-2 text-blue-800">
            <li>Ensure you have the correct patient ID</li>
            <li>Include relevant medical history in the condition description</li>
            <li>Be specific about current symptoms and concerns</li>
            <li>Mention any known allergies or medications</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GeneratePlanPage;