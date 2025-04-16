import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit2, FiSave, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';

const DraftPlanPage = () => {
  const navigate = useNavigate();
  const [planData, setPlanData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlan, setEditedPlan] = useState('');

  useEffect(() => {
    // Retrieve the generated plan from localStorage
    const storedPlan = localStorage.getItem('generatedPlan');
    if (storedPlan) {
      const parsedPlan = JSON.parse(storedPlan);
      setPlanData(parsedPlan);
      setEditedPlan(parsedPlan.plan);
    }
  }, []);

  const handleSave = () => {
    // Update the plan in localStorage
    if (planData) {
      const updatedPlan = {
        ...planData,
        plan: editedPlan,
        lastModified: new Date().toISOString()
      };
      localStorage.setItem('generatedPlan', JSON.stringify(updatedPlan));
      setPlanData(updatedPlan);
    }
    setIsEditing(false);
  };

  if (!planData) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Plan Found</h2>
          <button
            onClick={() => navigate('/Doctor/GeneratePlan')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generate New Plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/Doctor')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <FiArrowLeft className="mr-2" />
            Back to Dashboard
          </button>
          <div className="flex items-center space-x-4">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FiSave className="mr-2" />
                Save Changes
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiEdit2 className="mr-2" />
                Edit Plan
              </button>
            )}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Patient Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{planData.patient.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Age</p>
                <p className="font-medium">{planData.patient.age} years</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Conditions</p>
                <p className="font-medium">{planData.patient.conditions.join(', ')}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Care Plan</h2>
            {isEditing ? (
              <textarea
                value={editedPlan}
                onChange={(e) => setEditedPlan(e.target.value)}
                className="w-full h-96 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
              />
            ) : (
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap font-sans">{editedPlan}</pre>
              </div>
            )}
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>Generated on: {new Date(planData.timestamp).toLocaleString()}</p>
            {planData.lastModified && (
              <p>Last modified: {new Date(planData.lastModified).toLocaleString()}</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DraftPlanPage;