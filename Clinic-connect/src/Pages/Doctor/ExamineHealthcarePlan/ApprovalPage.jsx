import { motion } from 'framer-motion';
import { useApprovedPlanViewModel } from './ApprovedPlanViewModel';
import { FiArrowLeft, FiFileText, FiCheckCircle } from 'react-icons/fi';

const ApprovalPage = () => {
  const {
    plan,
    isLoading,
    error,
    handleBackToDraft,
    handleNewPlan
  } = useApprovedPlanViewModel();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-8 flex items-center justify-center">
        <div className="text-green-800 text-xl">Loading...</div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-green-900 mb-4">No Approved Plan Found</h2>
          <button
            onClick={handleNewPlan}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            Generate New Plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <button
              onClick={handleBackToDraft}
              className="flex items-center text-green-800 hover:text-green-900 mr-4"
            >
              <FiArrowLeft className="mr-2" />
              Back to Draft
            </button>
            <h1 className="text-3xl font-bold text-green-900">Approved Care Plan</h1>
          </div>
          <button
            onClick={handleNewPlan}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            Generate New Plan
          </button>
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-green-900">Plan Information</h2>
            <div className="flex items-center text-green-600">
              <FiCheckCircle className="mr-2" />
              <span className="font-semibold">Approved</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-green-50 p-4 rounded-lg border border-green-100 mb-6">
            <div>
              <p className="text-sm font-medium text-green-800">Patient ID</p>
              <p className="text-lg">{plan.patientId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-green-800">Doctor ID</p>
              <p className="text-lg">{plan.doctorId}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-green-800">Status</p>
              <p className="text-lg capitalize">{plan.status}</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center mb-4">
              <FiFileText className="text-green-600 mr-2" />
              <h3 className="text-xl font-semibold text-green-900">Care Plan Details</h3>
            </div>
            <div className="prose max-w-none bg-green-50 p-6 rounded-xl border border-green-100">
              <pre className="whitespace-pre-wrap font-mono text-gray-800">{plan.plan}</pre>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100 text-sm text-green-800">
            <p>Created: {new Date(plan.createdAt).toLocaleString()}</p>
            <p>Approved: {new Date(plan.updatedAt).toLocaleString()}</p>
          </div>
        </motion.div>

        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-semibold text-green-900 mb-3">Next Steps</h3>
          <ul className="list-disc list-inside space-y-2 text-green-800">
            <li>Share the approved plan with the patient</li>
            <li>Schedule follow-up appointments</li>
            <li>Monitor patient progress</li>
            <li>Update the plan as needed</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ApprovalPage;