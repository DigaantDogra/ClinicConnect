import { FiEdit2, FiSave, FiArrowLeft, FiCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useDraftPlanViewModel } from './DraftPlanViewModel';
import { useNavigate } from 'react-router-dom';

const DraftPlanPage = () => {
  const navigate = useNavigate();
  const {
    plan,
    isEditing,
    setIsEditing,
    editedPlan,
    setEditedPlan,
    isLoading,
    error,
    handleSave,
    handleApprove
  } = useDraftPlanViewModel();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 flex items-center justify-center">
        <div className="text-yellow-800 text-xl">Loading...</div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-yellow-900 mb-4">No Draft Plan Found</h2>
          <button
            onClick={() => navigate('/Doctor/GeneratePlan')}
            className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200"
          >
            Generate New Plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/Doctor')}
            className="flex items-center text-yellow-800 hover:text-yellow-900"
          >
            <FiArrowLeft className="mr-2" />
            Back to Dashboard
          </button>
          <div className="space-x-4">
            {isEditing ? (
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition-colors duration-200"
              >
                <FiSave className="mr-2" />
                Save Changes
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200"
              >
                <FiEdit2 className="mr-2" />
                Edit Plan
              </button>
            )}
            <button
              onClick={handleApprove}
              disabled={isLoading}
              className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
            >
              <FiCheck className="mr-2" />
              Approve Plan
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-yellow-900 mb-4">Draft Care Plan</h2>
            <div className="grid grid-cols-2 gap-4 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <div>
                <p className="text-sm font-medium text-yellow-800">Patient ID</p>
                <p className="text-lg">{plan.patientId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-800">Doctor ID</p>
                <p className="text-lg">{plan.doctorId}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-yellow-800">Status</p>
                <p className="text-lg capitalize">{plan.status}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-yellow-900 mb-4">Plan Details</h3>
            {isEditing ? (
              <textarea
                value={editedPlan}
                onChange={(e) => setEditedPlan(e.target.value)}
                className="w-full h-96 p-6 border-2 border-yellow-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none font-mono text-gray-800"
                placeholder="Enter the care plan details..."
              />
            ) : (
              <div className="prose max-w-none bg-yellow-50 p-6 rounded-xl border border-yellow-100">
                <pre className="whitespace-pre-wrap font-mono text-gray-800">{editedPlan}</pre>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100 text-sm text-yellow-800">
            <p>Created: {new Date(plan.createdAt).toLocaleString()}</p>
            {plan.updatedAt && (
              <p>Last modified: {new Date(plan.updatedAt).toLocaleString()}</p>
            )}
          </div>
        </motion.div>

        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-semibold text-yellow-900 mb-3">Editing Guidelines</h3>
          <ul className="list-disc list-inside space-y-2 text-yellow-800">
            <li>Review the generated plan thoroughly</li>
            <li>Make necessary adjustments to treatment recommendations</li>
            <li>Ensure all medications and dosages are correct</li>
            <li>Add any specific instructions for the patient</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DraftPlanPage;