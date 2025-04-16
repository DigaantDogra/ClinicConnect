import { ClipboardDocumentCheckIcon, DocumentArrowDownIcon, UserGroupIcon, CalendarIcon, HeartIcon } from '@heroicons/react/24/outline';

const HealthcarePlanPage = () => {
  // Mock data
  const healthcarePlan = {
    doctorName: "Dr. Emily Smith",
    approvalDate: "April 15, 2022",
    lastReview: "March 10, 2024",
    nextAppointment: "June 1, 2024",
    status: "Active",
    planItems: [
      {
        title: "Diabetes Management Plan",
        description: "Comprehensive type 2 diabetes management strategy",
        downloadUrl: "/plans/diabetes-plan.pdf"
      }
    ],
    doctorNotes: `Patient is responding well to current treatment regimen. Focus areas:
    - Maintain HbA1c below 7%
    - Monitor foot health weekly
    - Continue current medication dosage unless hypoglycemia occurs`,
    actionableSteps: [
      { id: 1, task: "Daily glucose monitoring (fasting & post-meal)", completed: true },
      { id: 2, task: "Weekly cardiovascular exercise (150 mins)", completed: false },
      { id: 3, task: "Monthly weight check-in", completed: false }
    ],
    medications: [
      { name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
      { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" }
    ]
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen">
      {/* Header Section */}
      <div className="mb-8 border-b pb-6">
        <div className="flex items-center gap-4 mb-4">
          <HeartIcon className="w-12 h-12 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Your Healthcare Management Plan
            </h1>
            <p className="text-gray-600 mt-1">
              Approved by {healthcarePlan.doctorName} on {healthcarePlan.approvalDate}
            </p>
          </div>
        </div>

        {/* Status and Download */}
        <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <ClipboardDocumentCheckIcon className="w-6 h-6 text-blue-600" />
            <span className="font-medium">Current Status:</span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              {healthcarePlan.status}
            </span>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <DocumentArrowDownIcon className="w-5 h-5" />
            Download Full Plan (PDF)
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Core Plan Details */}
        <div className="space-y-8">
          {/* Plan Overview */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <UserGroupIcon className="w-6 h-6 text-gray-600" />
              Plan Overview
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-600">Last Reviewed</dt>
                  <dd className="font-medium">{healthcarePlan.lastReview}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">Next Appointment</dt>
                  <dd className="font-medium">{healthcarePlan.nextAppointment}</dd>
                </div>
              </dl>
            </div>
          </section>

          {/* Doctor's Notes */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ClipboardDocumentCheckIcon className="w-6 h-6 text-gray-600" />
              Doctor's Notes
            </h2>
            <div className="bg-yellow-50 p-4 rounded-lg whitespace-pre-line border border-yellow-100">
              {healthcarePlan.doctorNotes}
            </div>
          </section>
        </div>

        {/* Right Column - Action Items */}
        <div className="space-y-8">
          {/* Actionable Steps */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-gray-600" />
              Action Plan
            </h2>
            <div className="bg-white border rounded-lg shadow-sm">
              {healthcarePlan.actionableSteps.map(step => (
                <div key={step.id} className="p-4 border-b last:border-b-0 flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={step.completed}
                    className="w-5 h-5 text-blue-600" 
                  />
                  <span className={step.completed ? "text-gray-400 line-through" : ""}>
                    {step.task}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Medication Schedule */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Current Medications</h2>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-2">Medication</th>
                    <th className="text-left px-4 py-2">Dosage</th>
                    <th className="text-left px-4 py-2">Frequency</th>
                  </tr>
                </thead>
                <tbody>
                  {healthcarePlan.medications.map((med, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-3">{med.name}</td>
                      <td className="px-4 py-3">{med.dosage}</td>
                      <td className="px-4 py-3">{med.frequency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      {/* Additional Resources */}
      <section className="mt-8 pt-6 border-t">
        <h3 className="text-lg font-semibold mb-4">Important Resources</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-3 border rounded-lg hover:bg-gray-50 text-sm">
            Request Prescription Refill
          </button>
          <button className="p-3 border rounded-lg hover:bg-gray-50 text-sm">
            Schedule Follow-up
          </button>
          <button className="p-3 border rounded-lg hover:bg-gray-50 text-sm">
            Contact Care Team
          </button>
          <button className="p-3 border rounded-lg hover:bg-gray-50 text-sm">
            View Lab Results
          </button>
        </div>
      </section>
    </div>
  );
};

export default HealthcarePlanPage;