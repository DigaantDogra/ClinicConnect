import { motion } from 'framer-motion';
import { FiArrowLeft, FiRefreshCw } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import useExamineHealthcarePlanViewModel from './ExamineHealthcarePlanViewModel';

const ExamineHealthcarePlan = () => {
  const navigate = useNavigate();
  const {
    carePlans,
    selectedPlan,
    loading,
    error,
    handlePlanSelect,
    refreshPlans,
    doctorNames
  } = useExamineHealthcarePlanViewModel();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/Patient')}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiArrowLeft className="mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-blue-900">My Healthcare Plans</h1>
          <button
            onClick={refreshPlans}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiRefreshCw className="mr-2" />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
          </div>
        ) : carePlans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No healthcare plans available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Plan List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">My Plans</h2>
                <div className="space-y-3">
                  {carePlans.map((plan) => (
                    <motion.button
                      key={plan.id}
                      onClick={() => handlePlanSelect(plan)}
                      className={`w-full text-left p-4 rounded-lg transition-colors ${
                        selectedPlan?.id === plan.id
                          ? 'bg-blue-100 border-2 border-blue-500'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="font-medium text-gray-800">
                        {plan.condition}
                      </div>
                      <div className="text-sm text-gray-500">
                        Created: {new Date(plan.dateCreated).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        Doctor: {doctorNames[plan.doctorId] || 'Loading...'}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Plan Details */}
            <div className="lg:col-span-2">
              {selectedPlan ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-lg p-6"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {selectedPlan.condition}
                      </h2>
                      <div className="text-sm text-gray-500 mt-1">
                        Created: {new Date(selectedPlan.dateCreated).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        Doctor: {doctorNames[selectedPlan.doctorId] || 'Loading...'}
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Approved
                    </span>
                  </div>

                  <div className="prose max-w-none">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Care Plan</h3>
                    <div className="whitespace-pre-wrap text-gray-700">
                      {selectedPlan.approvedCarePlan}
                    </div>

                    {selectedPlan.notes && (
                      <>
                        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">Doctor's Notes</h3>
                        <div className="whitespace-pre-wrap text-gray-700">
                          {selectedPlan.notes}
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                  <p className="text-gray-600">Select a plan to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamineHealthcarePlan;
