function ApprovalPage() {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Final Approval</h1>
          <div className="flex gap-4">
            <button className="text-gray-600">Request Revisions</button>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg">
              Approve Plan
            </button>
          </div>
        </div>
  
        {/* Plan Comparison Viewer */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="border p-4 rounded-lg">
            <h3 className="font-semibold mb-4">Original Draft</h3>
            <PlanVersionView content={originalDraft} />
          </div>
          <div className="border p-4 rounded-lg">
            <h3 className="font-semibold mb-4">Final Version</h3>
            <EditableFinalPlan content={finalVersion} />
          </div>
        </div>
  
        {/* Approval Log */}
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Approval History</h3>
          <ApprovalTimeline events={approvalEvents} />
        </div>
      </div>
    );
  }

export default ApprovalPage;